import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const auditLogsRouter = Router();

// Require admin access for audit logs
auditLogsRouter.use(requireAuth);
auditLogsRouter.use(requireAdmin);

/**
 * GET all audit logs for the agency with filtering
 */
auditLogsRouter.get("/", async (req, res) => {
  try {
    const { 
      entityType, 
      action, 
      userId, 
      startDate, 
      endDate, 
      search,
      page = 1,
      limit = 50
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      agencyId: req.agencyId,
      ...(entityType && { entityType }),
      ...(action && { action }),
      ...(userId && { userId }),
      ...(search && {
        OR: [
          { entityName: { contains: search, mode: 'insensitive' } },
          { userName: { contains: search, mode: 'insensitive' } },
          { userEmail: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }),
      ...((startDate || endDate) && {
        timestamp: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        }
      })
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take,
      }),
      prisma.auditLog.count({ where })
    ]);

    // Statistics for the dashboard
    const stats = await prisma.auditLog.groupBy({
      by: ['action'],
      where: { agencyId: req.agencyId },
      _count: true
    });

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / take)
      },
      stats
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

/**
 * GET specific log detail
 */
auditLogsRouter.get("/:id", async (req, res) => {
  try {
    const log = await prisma.auditLog.findFirst({
      where: {
        id: req.params.id,
        agencyId: req.agencyId
      }
    });

    if (!log) return res.status(404).json({ error: "Log entry not found" });

    res.json(log);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch log detail" });
  }
});

export default auditLogsRouter;
