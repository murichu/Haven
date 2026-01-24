import { Router } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const noticeRouter = Router();

noticeRouter.use(requireAuth);

// --- BROADCAST NOTICES (For the new Digital Notices UI) ---

const broadcastSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
  category: z.string().optional(),
  propertyId: z.string().optional(),
  expiresAt: z.string().optional().transform(s => s ? new Date(s) : null),
});

// GET /notices - Get all active broadcasts for the agency
noticeRouter.get("/", asyncHandler(async (req, res) => {
  const { propertyId, status = "ACTIVE" } = req.query;
  const where = { 
    agencyId: req.agencyId,
    status 
  };
  
  if (propertyId) where.propertyId = propertyId;

  const notices = await prisma.notice.findMany({
    where,
    include: { property: { select: { title: true } } },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json({ success: true, notices });
}));

// POST /notices - Create a new broadcast
noticeRouter.post("/", asyncHandler(async (req, res) => {
  const parsed = broadcastSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  
  const notice = await prisma.notice.create({
    data: {
      ...parsed.data,
      agencyId: req.agencyId
    }
  });
  
  res.status(201).json(notice);
}));

// DELETE /notices/:id - Archive/Withdraw a notice
noticeRouter.delete("/:id", asyncHandler(async (req, res) => {
  const notice = await prisma.notice.findFirst({
    where: { id: req.params.id, agencyId: req.agencyId }
  });
  
  if (!notice) return res.status(404).json({ error: "Notice not found" });
  
  await prisma.notice.update({
    where: { id: notice.id },
    data: { status: "ARCHIVED" }
  });
  
  res.status(204).send();
}));

// --- VACATE NOTICES (Legacy Compatibility) ---

const vacateSchema = z.object({
  leaseId: z.string(),
  plannedVacateAt: z.string().transform((s) => new Date(s)),
});

// Tenant posts notice to vacate
noticeRouter.post("/vacate", asyncHandler(async (req, res) => {
  const parsed = vacateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const lease = await prisma.lease.findFirst({ where: { id: parsed.data.leaseId, agencyId: req.agencyId } });
  if (!lease) return res.status(404).json({ error: "Lease not found" });
  
  const created = await prisma.vacateNotice.create({
    data: {
      leaseId: lease.id,
      tenantId: lease.tenantId,
      unitId: lease.unitId,
      agencyId: req.agencyId,
      noticeDate: new Date(),
      plannedVacateAt: parsed.data.plannedVacateAt,
    },
  });
  res.status(201).json(created);
}));

// Mark completed with actual date
noticeRouter.put("/vacate/:id/complete", asyncHandler(async (req, res) => {
  const parsed = z.object({ actualVacateAt: z.string().transform((s) => new Date(s)) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  
  const existing = await prisma.vacateNotice.findFirst({ where: { id: req.params.id, agencyId: req.agencyId } });
  if (!existing) return res.status(404).json({ error: "Not found" });
  
  const updated = await prisma.vacateNotice.update({ 
    where: { id: existing.id }, 
    data: { actualVacateAt: parsed.data.actualVacateAt, status: "COMPLETED" } 
  });
  res.json(updated);
}));
