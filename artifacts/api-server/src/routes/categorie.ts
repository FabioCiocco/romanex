import { Router } from "express";
import { db, annunciTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { CATEGORIE } from "./annunci";

const router = Router();

router.get("/", async (req, res) => {
  const countsByCategoria = await db
    .select({ categoria: annunciTable.categoria, count: count() })
    .from(annunciTable)
    .groupBy(annunciTable.categoria);

  const countMap = new Map(countsByCategoria.map((r) => [r.categoria, r.count]));

  const categorie = CATEGORIE.map((c) => ({
    ...c,
    count: countMap.get(c.id) ?? 0,
  }));

  return res.json(categorie);
});

export { router as categorieRouter };
