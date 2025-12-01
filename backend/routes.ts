import express, { Request, Response } from "express";
import dotenv from "dotenv";
import debRouter from "./api_routes/debian.js";
import archRouter from "./api_routes/arch.js";
import windowsRouter from "./api_routes/windows.js";

dotenv.config();
const router = express.Router();


router.use("/deb", debRouter)
router.use("/arch", archRouter)
router.use("/winget", windowsRouter)


router.get("/", async (_req: Request, res: Response) => {
  res.status(200).json({ message: "/api is good..." });
});

export default router;
