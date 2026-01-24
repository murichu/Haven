import { prisma } from "../db.js";

/**
 * Standardized utility for creating audit logs.
 * @param {Object} req - Express request object (to extract user and agency)
 * @param {Object} options - Log details
 * @param {string} options.action - Action taken (CREATE, UPDATE, DELETE, etc.)
 * @param {string} options.entityType - Model being affected (e.g., 'Property')
 * @param {string} options.entityId - ID of the record
 * @param {string} options.description - Human readable summary
 * @param {Object} options.metadata - JSON data for old/new values
 */
export async function auditLog(req, { action, entityType, entityId, entityName, description, metadata }) {
  try {
    const agencyId = req.agencyId;
    const userId = req.user?.id || req.agent?.agentId;
    const userName = req.user?.name || req.agent?.name || "System";
    const userEmail = req.user?.email || req.agent?.email || "system@haven.com";

    if (!agencyId || !userId) return;

    await prisma.auditLog.create({
      data: {
        agencyId,
        userId,
        userName,
        userEmail,
        action,
        entityType,
        entityId,
        entityName,
        description,
        metadata: metadata || {},
        ipAddress: req.ip || req.headers['x-forwarded-for'],
        userAgent: req.headers['user-agent'],
        timestamp: new Date()
      }
    });
  } catch (error) {
    // Avoid blocking the main request if logging fails
    console.error("Audit Logging Error:", error);
  }
}

export default auditLog;
