import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting expanded seeding...");

  // Reset existing data
  console.log("🗑️  Cleaning database...");
  
  const safeDelete = async (modelName) => {
    if (prisma[modelName]) {
        console.log(`- Deleting ${modelName}...`);
        await prisma[modelName].deleteMany();
    } else {
        console.warn(`- Model ${modelName} not found in client, skipping.`);
    }
  };

  const modelsToClear = [
    "auditLog", "expense", "penalty", "notice", "vacateNotice", 
    "caretakerPayment", "caretaker", "agent", "payment", "invoice", 
    "mpesaTransaction", "pesapalTransaction", "lease", "unit", 
    "tenant", "property", "refreshToken", "user", "agency"
  ];

  for (const model of modelsToClear) {
      await safeDelete(model);
  }

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create 4 Agencies
  console.log("🏢 Creating 4 Agencies...");
  const agencyNames = ["Haven Premier Management", "Skyline Realty Group", "Urban Living Estates", "Heritage Property Hub"];
  const agencies = [];
  for (const name of agencyNames) {
    const agency = await prisma.agency.create({
      data: {
        name,
        invoiceDayOfMonth: 28,
        dueDayOfMonth: 5,
      },
    });
    agencies.push(agency);
  }

  // 2. Create 12 Users (3 per agency)
  console.log("👤 Creating 12 Users...");
  const users = [];
  for (const agency of agencies) {
    const agencySlug = agency.name.toLowerCase().replace(/\s/g, '');
    const roles = ["ADMIN", "USER", "USER"];
    for (let i = 0; i < 3; i++) {
        const user = await prisma.user.create({
            data: {
              email: `${roles[i].toLowerCase()}${i}@${agencySlug}.com`,
              name: `${agency.name} ${roles[i]} ${i+1}`,
              passwordHash,
              role: roles[i],
              agencyId: agency.id,
              emailVerified: true,
            },
          });
          users.push(user);
    }
  }

  // Helper for random pick
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  // 3. Create 20 Properties (5 per agency)
  console.log("🏠 Creating 20 Properties...");
  const counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu"];
  const propertyTitles = ["Sunset Heights", "Green Valley", "The Landmark", "Oak Residency", "Crystal Plaza", "Heritage Court", "Zion Towers", "Aspen Suites", "Marina Bay", "Palms Residency"];
  const properties = [];
  for (const agency of agencies) {
    for (let i = 0; i < 5; i++) {
        const prop = await prisma.property.create({
            data: {
                title: `${pick(propertyTitles)} Phase ${i+1}`,
                address: `${randomInt(100, 999)} ${pick(["Main St", "Ring Rd", "Avenue", "Way"])}`,
                city: pick(counties),
                state: `${pick(counties)} County`,
                zip: `00${randomInt(100, 900)}`,
                bedrooms: randomInt(1, 4),
                bathrooms: randomInt(1, 4),
                sizeSqFt: randomInt(500, 2500),
                rentAmount: randomInt(20000, 150000),
                status: "AVAILABLE",
                type: pick(["TWO_BEDROOM", "THREE_BEDROOM", "ONE_BEDROOM", "MAISONETTE", "TOWNHOUSE", "VILLA"]),
                agencyId: agency.id,
            }
        });
        properties.push(prop);
    }
  }

  // 4. Create 60 Units (3 per property)
  console.log("🚪 Creating 60 Units...");
  const units = [];
  for (const property of properties) {
    for (let i = 1; i <= 3; i++) {
        const unit = await prisma.unit.create({
            data: {
                propertyId: property.id,
                unitNumber: `${pick(["A", "B", "C"])}${i}0${randomInt(1, 9)}`,
                type: property.type,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                sizeSqFt: property.sizeSqFt,
                rentAmount: property.rentAmount,
                status: pick(["VACANT", "OCCUPIED", "MAINTENANCE"]),
            }
        });
        units.push(unit);
    }
  }

  // 5. Create 40 Tenants
  console.log("👨‍👩‍👧‍👦 Creating 40 Tenants...");
  const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
  const lastNames = ["Kamau", "Ochieng", "Wanjiku", "Njoroge", "Musa", "Hassan", "Adu", "Okello", "Moraa", "Chepngetich"];
  const tenants = [];
  for (const agency of agencies) {
    for (let i = 0; i < 10; i++) {
        const tenant = await prisma.tenant.create({
            data: {
                name: `${pick(firstNames)} ${pick(lastNames)}`,
                email: `${pick(firstNames).toLowerCase()}.${pick(lastNames).toLowerCase()}.${randomInt(10,99)}@example.com`,
                phone: `+2547${randomInt(10000000, 99999999)}`,
                agencyId: agency.id,
                averageRating: randomInt(3, 5),
                isHighRisk: Math.random() > 0.9,
            }
        });
        tenants.push(tenant);
    }
  }

  // 6. Create 30 Leases (assign to occupied units)
  console.log("📄 Creating 30 Leases...");
  const leases = [];
  const occupiedUnits = units.filter(u => u.status === "OCCUPIED").slice(0, 30);
  
  for (let i = 0; i < occupiedUnits.length; i++) {
    const unit = occupiedUnits[i];
    const property = properties.find(p => p.id === unit.propertyId);
    const agencyTenants = tenants.filter(t => t.agencyId === property.agencyId);
    if (agencyTenants.length === 0) continue;
    
    const tenant = pick(agencyTenants);
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - randomInt(1, 6), 1);
    
    const lease = await prisma.lease.create({
        data: {
            unitId: unit.id,
            tenantId: tenant.id,
            agencyId: property.agencyId,
            propertyId: property.id,
            startDate: startDate,
            endDate: new Date(startDate.getFullYear() + 1, startDate.getMonth(), 1),
            rentAmount: unit.rentAmount,
            paymentDayOfMonth: randomInt(1, 5),
        }
    });
    leases.push(lease);
  }

  // 7. Create 100 Financial Records (Invoices & Payments)
  console.log("🧾 Creating 100+ Financial Records...");
  for (const lease of leases) {
    // Current month invoice
    const now = new Date();
    const invoice = await prisma.invoice.create({
        data: {
            leaseId: lease.id,
            agencyId: lease.agencyId,
            amount: lease.rentAmount,
            periodYear: now.getFullYear(),
            periodMonth: now.getMonth() + 1,
            issuedAt: new Date(now.getFullYear(), now.getMonth(), 28),
            dueAt: new Date(now.getFullYear(), now.getMonth() + 1, 5),
            status: pick(["PAID", "PENDING", "OVERDUE"]),
            totalPaid: 0,
        }
    });

    if (invoice.status === "PAID") {
        await prisma.invoice.update({
            where: { id: invoice.id },
            data: { totalPaid: lease.rentAmount }
        });

        await prisma.payment.create({
            data: {
                leaseId: lease.id,
                invoiceId: invoice.id,
                amount: lease.rentAmount,
                paidAt: new Date(),
                method: pick(["MPESA_C2B", "BANK_TRANSFER", "CASH"]),
                referenceNumber: `REF${randomInt(10000, 99999)}`,
                agencyId: lease.agencyId,
            }
        });
    }

    // Historical record (2 months ago)
    const oldDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const oldInvoice = await prisma.invoice.create({
        data: {
            leaseId: lease.id,
            agencyId: lease.agencyId,
            amount: lease.rentAmount,
            periodYear: oldDate.getFullYear(),
            periodMonth: oldDate.getMonth() + 1,
            issuedAt: new Date(oldDate.getFullYear(), oldDate.getMonth(), 28),
            dueAt: new Date(oldDate.getFullYear(), oldDate.getMonth() + 1, 5),
            status: "PAID",
            totalPaid: lease.rentAmount,
        }
    });

    await prisma.payment.create({
        data: {
            leaseId: lease.id,
            invoiceId: oldInvoice.id,
            amount: lease.rentAmount,
            paidAt: new Date(oldDate.getFullYear(), oldDate.getMonth() + 1, 2),
            method: "MPESA_C2B",
            referenceNumber: `HIST${randomInt(10000, 99999)}`,
            agencyId: lease.agencyId,
        }
    });
  }

  // 8. Create 40 Expenses
  console.log("💸 Creating 40 Expenses...");
  const expenseCats = ["MAINTENANCE", "UTILITIES", "REPAIRS", "INSURANCE", "TAXES", "SALARIES", "MARKETING"];
  for (const agency of agencies) {
    const agencyProps = properties.filter(p => p.agencyId === agency.id);
    for (let i = 0; i < 10; i++) {
        await prisma.expense.create({
            data: {
                agencyId: agency.id,
                propertyId: pick(agencyProps)?.id,
                category: pick(expenseCats),
                amount: randomInt(500, 15000),
                description: `Monthly ${pick(expenseCats).toLowerCase()} costs`,
                expenseDate: new Date(),
                vendor: "Local Services Ltd",
                status: "APPROVED",
            }
        });
    }
  }

  // 9. Extra UI Entities (Notices/Penalties)
  console.log("🔔 Creating UI Entities (Notices & Penalties)...");
  for (const agency of agencies) {
    await prisma.notice.create({
        data: {
            agencyId: agency.id,
            title: "Scheduled Maintenance Notification",
            content: "Please be advised of scheduled water maintenance this weekend.",
            priority: "NORMAL",
            category: "MAINTENANCE",
            status: "ACTIVE"
        }
    });

    const agencyLeases = leases.filter(l => l.agencyId === agency.id);
    if (agencyLeases.length > 0) {
        const lease = pick(agencyLeases);
        await prisma.penalty.create({
            data: {
                agencyId: agency.id,
                type: "LATE_PAYMENT",
                amount: 1500,
                reason: "Late rent payment for previous cycle",
                status: "PENDING"
            }
        });
    }
  }

  console.log("✅ Expanded Seeding Completed!");
  console.log(`- Total Agencies: ${agencies.length}`);
  console.log(`- Total Users: ${users.length}`);
  console.log(`- Total Properties: ${properties.length}`);
  console.log(`- Total Units: ${units.length}`);
  console.log(`- Total Tenants: ${tenants.length}`);
  console.log(`- Total Leases: ${leases.length}`);
  console.log("\n🔑 Test Account Generator:");
  console.log(`Email: admin0@havenpremiermanagement.com`);
  console.log(`Password: password123`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
