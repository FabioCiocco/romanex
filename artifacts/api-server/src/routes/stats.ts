import { Router } from "express";
import { db, annunciTable } from "@workspace/db";
import { count, sql } from "drizzle-orm";
import { CATEGORIE } from "./annunci";

const router = Router();

router.get("/", async (req, res) => {
  const [totaleResult, annunciOggiResult, cittaResult, categorieResult] =
    await Promise.all([
      db.select({ count: count() }).from(annunciTable),
      db
        .select({ count: count() })
        .from(annunciTable)
        .where(
          sql`DATE(${annunciTable.createdAt}) = CURRENT_DATE`
        ),
      db
        .select({ citta: annunciTable.citta, count: count() })
        .from(annunciTable)
        .groupBy(annunciTable.citta)
        .orderBy(sql`count(*) DESC`)
        .limit(5),
      db
        .select({ categoria: annunciTable.categoria, count: count() })
        .from(annunciTable)
        .groupBy(annunciTable.categoria)
        .orderBy(sql`count(*) DESC`),
    ]);

  return res.json({
    totaleAnnunci: totaleResult[0]?.count ?? 0,
    annunciOggi: annunciOggiResult[0]?.count ?? 0,
    totaleCategorie: CATEGORIE.length,
    cittaPiuAttive: cittaResult,
    annunciPerCategoria: categorieResult,
  });
});

export { router as statsRouter };
