import express from "express";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
router.get("/", async (_req, res) => {
    res.status(200).json({ message: "/api is good..." });
});
router.get("/winget", async (req, res) => {
    const { query } = req.query; // this is ?query=brave
    if (!query) {
        return res.status(400).json({ message: "query is required" });
    }
    const apiResponse = await fetch(`${process.env.WINGET_API_LINK}/${query}`);
    const data = await apiResponse.json();
    if (!data.Packages || data.Packages.length === 0) {
        res.status(200).json({ message: `Cant find any package named ${query}` });
        return;
    }
    res.status(200).json({ query, data });
});
export default router;
