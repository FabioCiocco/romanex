import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import healthRouter from "./health";
import { annunciRouter } from "./annunci";
import { categorieRouter } from "./categorie";
import { statsRouter } from "./stats";
import { forumRouter } from "./forum";
import { profiloRouter } from "./profilo";
import { adminRouter } from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.get("/whoami", (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId, adminIds: process.env.ADMIN_CLERK_IDS || "(non impostato)" });
});
router.use("/annunci", annunciRouter);
router.use("/categorie", categorieRouter);
router.use("/stats", statsRouter);
router.use("/forum", forumRouter);
router.use("/profilo", profiloRouter);
router.use("/admin", adminRouter);

export default router;
