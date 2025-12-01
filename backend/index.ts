import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes.js";

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use("/api", router);

app.use("/", (_req: Request, res: Response) => {
  res.json({ message: "Everything is fine for now..." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
