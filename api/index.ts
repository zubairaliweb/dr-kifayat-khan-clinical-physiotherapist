import type { Request, Response } from "express";
import { app, initializeDatabase } from "../server";

let databaseReady: Promise<void> | undefined;

export default function handler(req: Request, res: Response) {
  databaseReady ??= initializeDatabase().catch(() => undefined);
  return app(req, res);
}