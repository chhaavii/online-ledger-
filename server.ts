import express from "express";
import path from "path";
// #made by chhavi :)
import { createServer as createViteServer } from "vite";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getKeywords,
  setKeywords,
} from "./server/dataStore.js";
import { computeLedger } from "./src/ledgerEngine.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/transactions", (req, res) => {
    const txs = getTransactions();
    res.json(txs);
  });

  app.post("/api/transactions", (req, res) => {
    const { date, amount, desc, whose, category, idempotencyKey } = req.body;

    if (!desc || amount === undefined || !whose) {
      return res.status(400).json({ error: "Missing required fields: desc, amount, whose" });
    }

    const key = idempotencyKey || `req-${Date.now()}-${Math.random()}`;
    const result = addTransaction({
      date,
      amount,
      desc,
      whose,
      category,
      idempotencyKey: key,
    });

    res.status(result.duplicate ? 200 : 201).json(result);
  });

  app.patch("/api/transactions/:id", (req, res) => {
    const { id } = req.params;
    const { reimbursed, category, desc } = req.body;

    const updated = updateTransaction(id, { reimbursed, category, desc });
    if (!updated) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(updated);
  });

  app.delete("/api/transactions/:id", (req, res) => {
    const { id } = req.params;
    const success = deleteTransaction(id);
    if (!success) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ success: true, id });
  });

  app.get("/api/keywords", (req, res) => {
    const keywords = getKeywords();
    res.json(keywords);
  });

  app.put("/api/keywords", (req, res) => {
    const newKeywords = req.body;
    if (!Array.isArray(newKeywords)) {
      return res.status(400).json({ error: "Body must be an array of [keyword, category] pairs" });
    }
    const updated = setKeywords(newKeywords);
    res.json(updated);
  });

  app.get("/api/ledger", (req, res) => {
    const txs = getTransactions();
    const ledger = computeLedger(txs);
    res.json(ledger);
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Online Ledger" });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Online Ledger] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
