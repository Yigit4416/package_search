import express, { Request, Response } from "express"
import { BadRequestError, NotFoundError } from "../error_class/custom-errors.js";
import { WingetQueryResponse } from "../types/winget.js";
import { wingetGetData, wingetStoreData } from "../db/cache.js";

const windowsRouter = express.Router()

windowsRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string

    if (!query || typeof query !== "string") {
      throw new BadRequestError("Query is required")
    }

    const apiResponse = await fetch(`${process.env.WINGET_API_LINK}${query}`);

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
    console.error("Error on /winget/search", err);

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

windowsRouter.get("/package/:wingetid", async (req: Request, res: Response) => {
  try {
    const wingetId: string = req.params.wingetid as string;
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

export default windowsRouter
