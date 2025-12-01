import dotenv from "dotenv"
import express, { Request, Response } from "express"
import { BadRequestError, NotFoundError } from "../error_class/custom-errors"
import { ArchPackage, ArchPackageQueryResponse, ArchPackageSearchResponse } from "../types/pacman"
import { aurGetData, aurStoreData, pacmanGetData, pacmanStoreData } from "../db/test_temp"
import { AurQueryResponse, AurResponse } from "../types/aur"

dotenv.config()
const archRouter = express.Router()

archRouter.get("/", async (_req: Request, res: Response) => {
  res.status(200).json({ message: "/arch is good" })
})

archRouter.get("/pacman/search", async (req: Request, res: Response) => {
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

archRouter.get("/pacman/package/:pacmanid", async (req: Request, res: Response) => {
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

archRouter.get("/aur/search", async (req: Request, res: Response) => {
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

archRouter.get("/aur/package/:aurid", async (req: Request, res: Response) => {
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

export default archRouter
