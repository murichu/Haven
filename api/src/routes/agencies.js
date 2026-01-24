import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { auditLog } from "../utils/auditLogger.js";

export const agencyRouter = Router();

agencyRouter.use(requireAuth);

agencyRouter.get("/", async (req, res) => {
  try {
    const agencies = await prisma.agency.findMany({
      where: { id: req.agencyId }
    });
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agencies" });
  }
});

agencyRouter.get("/me", async (req, res) => {
  const agency = await prisma.agency.findUnique({ where: { id: req.agencyId } });
  if (!agency) return res.status(404).json({ error: "Not found" });
  res.json(agency);
});

const updateSchema = z.object({ name: z.string().min(2) });

agencyRouter.put("/me", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const updated = await prisma.agency.update({ where: { id: req.agencyId }, data: parsed.data });

  await auditLog(req, {
    action: "UPDATE",
    entityType: "Agency",
    entityId: updated.id,
    entityName: updated.name,
    description: `Agency profile/settings updated`
  });

  res.json(updated);
});
