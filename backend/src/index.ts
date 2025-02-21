/* IMPORTS */
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "prisma";
const prisma = new PrismaClient();

const app = express();

import { Request, Response } from "express";

app.use(
  cors({
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

const port = process.env.PORT || 3000;
const server = http.createServer(app);

/* ROUTES */

app.get("/", async (req: Request, res: Response) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

server.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
