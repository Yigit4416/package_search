import dotenv from "dotenv";
import express, { Request, Response } from "express"
import { AptSearchResult, DebianPackageInfo } from "../types/apt";
import { BadRequestError, NotFoundError } from "../error_class/custom-errors";
import { aptGetData, aptStoreData } from "../db/test_temp";

dotenv.config()
const debRouter = express.Router()

debRouter.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json("/debian is good")
})

debRouter.get("/apt/search", async (req: Request, res: Response) => {
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

debRouter.get("/apt/package/:packagename", async (req: Request, res: Response) => {
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

export default debRouter
