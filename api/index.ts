import type { Request, Response } from "express";
import { app, initializeDatabase } from "../server";

let databaseReady: Promise<void> | undefined;

export default async function handler(req: Request, res: Response) {
  databaseReady ??= initializeDatabase();
  await databaseReady;
  return app(req, res);
}