import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { WingetQueryResponse } from "./types/winget.js";
import { aptGetData, aptStoreData, aurGetData, aurStoreData, pacmanGetData, pacmanStoreData, wingetGetData, wingetStoreData } from "./db/test_temp.js";
import { BadRequestError, NotFoundError } from "./error_class/custom-errors.js";
import { ArchPackageSearchResponse, ArchPackageQueryResponse, ArchPackage } from "./types/pacman.js";
import { AurQueryResponse, AurResponse } from "./types/aur.js";
import { AptSearchResult, DebianPackageInfo } from "./types/apt.js";

dotenv.config();
const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  res.status(200).json({ message: "/api is good..." });
});

router.get("/winget/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      throw new BadRequestError("Query is required")
    }

    const apiResponse = await fetch(`${process.env.WINGET_API_LINK}/${query}`);

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        error: "Failed to fetch from Winget API",
      });
    }

    const data: WingetQueryResponse["data"] = await apiResponse.json();

    if (!data.Packages || data.Packages.length === 0) {
      return res.status(200).json({
        message: `Can't find any package named ${query}`,
      });
    }

    // Store in background (fire and forget)
    wingetStoreData(data.Packages).catch(err => {
      console.error("Background DB storage failed:", err);
    });

    // Return immediately without waiting
    res.status(200).json({ query, data } as WingetQueryResponse);

  } catch (err) {
    console.error("Error on /arch/pacman/search", err);

    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ error: err.message })
    }

    else if (err instanceof BadRequestError) {
      return res.status(err.statusCode).json({ error: err.message })
    }

    console.error("Error in /winget/search:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/winget/package/:wingetid", async (req: Request, res: Response) => {
  try {
    const wingetId: string = req.params.wingetid;
    const result = wingetGetData(wingetId);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /winget/package:", err);

    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/arch/pacman/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query
    if (!query || typeof query !== "string") {
      throw new BadRequestError("Query is required")
    }

    const apiResponse = await fetch(`${process.env.PACMAN_API_LINK}${query}`)

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: "Failed to fetch from pacman API" })
    }

    const fullResponse: ArchPackageSearchResponse = await apiResponse.json()
    const data: ArchPackage[] = fullResponse.results

    if (!data || data.length === 0) {
      return res.status(200).json({
        message: `Can not find any pacman package named ${query}`
      })
    }

    // Send response immediately
    res.status(200).json({ query, data } as ArchPackageQueryResponse)

    // Store data in background without blocking
    pacmanStoreData(data).catch(err => console.error("Failed to store pacman data:", err))

  } catch (err) {
    console.error("Error on /arch/pacman/search", err)
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ error: err.message })
    }
    else if (err instanceof BadRequestError) {
      return res.status(err.statusCode).json({ error: err.message })
    }
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/arch/pacman/package/:pacmanid", async (req: Request, res: Response) => {
  try {
    const pacmanId: string = req.params.pacmanid
    const result = await pacmanGetData(pacmanId)
    res.status(200).json(result)
  } catch (err) {
    console.error("Error on /pacman/package/:pacmanid: ", err)
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ error: err.message })
    }
    else if (err instanceof BadRequestError) {
      return res.status(err.statusCode).json({ error: err.message })
    }
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/arch/aur/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query
    if (!query || typeof query !== "string") {
      throw new BadRequestError("Query is required and must be string")
    }

    const apiResponse = await fetch(`${process.env.AUR_API_LINK}${query}`)

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: "Failed to fetch from AUR API." })
    }

    const allData: AurResponse = await apiResponse.json()

    if (allData.resultcount === 0) {
      return res.status(200).json({ message: `Can't find any AUR package named ${query}` })
    }

    aurStoreData(allData.results).catch(err => console.error("Background AUR DB storage failed: ", err))

    const data = allData.results

    res.status(200).json({ query, data } as AurQueryResponse)
  } catch (err) {
    console.log(err)
    if (err instanceof NotFoundError) {
      res.status(err.statusCode).json({ error: err.message })
      return;
    }

    else if (err instanceof BadRequestError) {
      res.status(err.statusCode).json({ error: err.message })
      return;
    }

    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/arch/aur/package/:aurid", async (req: Request, res: Response) => {
  try {
    const aurId = Number(req.params.aurid)

    if (!aurId && isNaN(aurId)) {
      throw new BadRequestError("AUR ID is required and must to be number")
    }

    const result = await aurGetData(aurId)
    res.status(200).json(result)
  } catch (err) {
    console.error("Error on /aur/package/:aurid : ", err)
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ error: err.message })
    }
    else if (err instanceof BadRequestError) {
      return res.status(err.statusCode).json({ error: err.message })
    }
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/debian/apt/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query

    const apiResponse = await fetch(`${process.env.APT_API_LINK_GENERAL}/${query}`)

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: "Failed to fetch from Debian API" })
    }

    const result: AptSearchResult = await apiResponse.json()

    if (result.results.exact === null && result.results.other === null) {
      return res.status(200).json({ message: `Can't find any Debian APT package named ${query}` })
    }

    return res.status(200).json(result)
  } catch (err) {
    console.log(err)
    if (err instanceof NotFoundError) {
      res.status(err.statusCode).json({ error: err.message })
      return;
    }

    else if (err instanceof BadRequestError) {
      res.status(err.statusCode).json({ error: err.message })
      return;
    }

    res.status(500).json({ error: "Internal server error on /debian/apt/search" })
  }
})

router.get("/debian/apt/package/:packagename", async (req: Request, res: Response) => {
  try {
    const packagename = req.params.packagename

    try {
      // Try to get from DB first
      const dbResult = await aptGetData(packagename)
      return res.status(200).json(dbResult)
    } catch (err) {
      // If not in DB, fetch from API
      if (err instanceof NotFoundError) {
        const apiResponse = await fetch(`${process.env.APT_API_LINK_GENERAL}/${packagename}`)

        if (!apiResponse.ok) {
          return res.status(apiResponse.status).json({ error: "Failed to fetch Debian API" })
        }

        const apiResult: DebianPackageInfo = await apiResponse.json()

        // Store in background (non-blocking)
        aptStoreData(apiResult).catch(err =>
          console.error("Background DB storage failed:", err)
        )

        // Return response immediately for user responsiveness
        return res.status(200).json(apiResult)
      }
      throw err // Re-throw if it's not NotFoundError
    }
  } catch (err) {
    console.error("Error on /debian/apt/package/:packagename : ", err)

    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ error: err.message })
    } else if (err instanceof BadRequestError) {
      return res.status(err.statusCode).json({ error: err.message })
    }

    return res.status(500).json({ error: "Internal Server Error on /debian/apt/package" })
  }
})

export default router;
