import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "DATABASE_URL is not set — set it in backend/.env before running seed",
  );
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function upsertRegion(code, name) {
  return prisma.region.upsert({
    where: { name },
    update: { code },
    create: { name, code },
  });
}

async function ensureAdmin(email, password) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin user already exists:", email);
    return existing;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: "ADMIN",
      name: "Admin",
    },
  });
  console.log("Created admin user:", email);
  return user;
}

async function main() {
  console.log("Seeding regions and admin user...");

  const regions = [
    { code: "OAU", name: "OAU Campus" },
    { code: "IFE", name: "Ile-Ife" },
    { code: "OSN", name: "Osun State" },
  ];

  for (const r of regions) {
    await upsertRegion(r.code, r.name);
    console.log("Upserted region", r.code);
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@davedeals.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  await ensureAdmin(adminEmail, adminPassword);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
