import { prisma } from "../db.js";
import logger from "../utils/logger.js";

/**
 * Automation Service
 * Handles periodic business logic like penalty calculations and invoice generation.
 */

/**
 * Calculate late payment penalties for all agencies.
 * Rule: KES 500/day past due for invoices not fully paid.
 */
export async function runPenaltyAutomation() {
    logger.info("Starting Daily Penalty Automation...");
    const today = new Date();
    
    try {
        // Find all unpaid invoices that are past their due date
        const overdueInvoices = await prisma.invoice.findMany({
            where: {
                status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
                dueAt: { lt: today },
            },
            include: {
                lease: true,
            }
        });

        logger.info(`Found ${overdueInvoices.length} potentially overdue invoices.`);

        for (const invoice of overdueInvoices) {
            const daysOverdue = Math.ceil((today.getTime() - invoice.dueAt.getTime()) / (1000 * 60 * 60 * 24));
            const penaltyAmount = daysOverdue * 500;

            // Update or create penalty
            await prisma.penalty.upsert({
                where: {
                    // Assuming a unique constraint or finding existing for this invoice
                    // For now, we manually handle it or create daily
                    id: `penalty-${invoice.id}-${today.toISOString().split('T')[0]}` 
                },
                update: {
                    amount: penaltyAmount,
                    days: daysOverdue,
                    computedAt: today,
                },
                create: {
                    id: `penalty-${invoice.id}-${today.toISOString().split('T')[0]}`,
                    agencyId: invoice.agencyId,
                    invoiceId: invoice.id,
                    type: "LATE_PAYMENT",
                    amount: penaltyAmount,
                    days: daysOverdue,
                    reason: `Late payment penalty for ${daysOverdue} days`,
                    computedAt: today,
                }
            });

            // Update invoice status to OVERDUE if not already
            if (invoice.status !== "OVERDUE") {
                await prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { status: "OVERDUE" }
                });
            }
        }

        logger.info("Penalty Automation completed successfully.");
    } catch (error) {
        logger.error("Error in Penalty Automation:", error);
    }
}

/**
 * Generate monthly invoices based on Agency settings.
 * Runs at the start of each month or on the 'invoiceDayOfMonth'.
 */
export async function runInvoiceAutomation() {
    logger.info("Starting Monthly Invoice Automation...");
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    try {
        const agencies = await prisma.agency.findMany();

        for (const agency of agencies) {
            // Only generate if today is the invoice day
            if (today.getDate() !== agency.invoiceDayOfMonth) continue;

            // Find all active leases for this agency
            const activeLeases = await prisma.lease.findMany({
                where: {
                    agencyId: agency.id,
                    startDate: { lte: today },
                    OR: [
                        { endDate: null },
                        { endDate: { gte: today } }
                    ]
                }
            });

            for (const lease of activeLeases) {
                // Check if invoice already exists for this period
                const existing = await prisma.invoice.findFirst({
                    where: {
                        leaseId: lease.id,
                        periodYear: currentYear,
                        periodMonth: currentMonth
                    }
                });

                if (existing) continue;

                // Create new invoice
                const dueAt = new Date(today);
                dueAt.setDate(agency.dueDayOfMonth);
                if (dueAt < today) dueAt.setMonth(dueAt.getMonth() + 1);

                await prisma.invoice.create({
                    data: {
                        leaseId: lease.id,
                        agencyId: agency.id,
                        amount: lease.rentAmount,
                        periodYear: currentYear,
                        periodMonth: currentMonth,
                        issuedAt: today,
                        dueAt: dueAt,
                        status: "PENDING"
                    }
                });
            }
        }

        logger.info("Invoice Automation completed successfully.");
    } catch (error) {
        logger.error("Error in Invoice Automation:", error);
    }
}
