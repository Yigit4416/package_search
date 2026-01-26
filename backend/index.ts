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

// Parse the port and provide a fallback
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});