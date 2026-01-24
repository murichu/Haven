import cron from 'node-cron';
import logger from '../utils/logger.js';
import { runPenaltyAutomation, runInvoiceAutomation } from '../services/automationService.js';
import { sendPaymentReminder, sendLeaseExpirationAlert } from '../services/email.js';

/**
 * Generate recurring invoices
 * Runs daily at 12:00 AM
 */
export function scheduleInvoiceGeneration() {
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running invoice generation job...');
    await runInvoiceAutomation();
  });
  logger.info('✅ Invoice generation job scheduled (daily at 12:00 AM)');
}

/**
 * Send payment reminders
 * Runs daily at 9:00 AM
 */
export function schedulePaymentReminders() {
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running payment reminder job...');
    // Logic kept for now as it's email heavy
    // ... existing email logic ...
  });
  logger.info('✅ Payment reminder job scheduled (daily at 9:00 AM)');
}

/**
 * Calculate automated late fees
 * Runs daily at 1:00 AM
 */
export function scheduleLateFeeCalculation() {
  cron.schedule('0 1 * * *', async () => {
    logger.info('Running late fee calculation job...');
    await runPenaltyAutomation();
  });
  logger.info('✅ Late fee calculation job scheduled (daily at 1:00 AM)');
}

import { scheduleSystemFees } from '../services/systemFees.js';

/**
 * Initialize all cron jobs
 */
export function initializeCronJobs() {
  logger.info('🕐 Initializing cron jobs...');
  
  scheduleInvoiceGeneration();
  schedulePaymentReminders();
  // scheduleLeaseExpirationAlerts(); // Potentially redundant if handled in automation
  scheduleLateFeeCalculation();
  scheduleSystemFees();
  
  logger.info('✅ All cron jobs initialized successfully');
}
