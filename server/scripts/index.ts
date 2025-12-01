import { PrismaService } from "src/shared/services/prisma.service";
import { main as seedRoleMain } from "./seed-roles";
import seedPermissionsBootstrap from "./seed-permissions";
import seedBrandsMain from "./seed-brands";
import seedCategoriesMain from "./seed-categories";

const prisma = new PrismaService();

async function seedRoles() {
  console.log("\n=== Starting Role Seeding ===");
  await seedRoleMain();
  console.log("✅ Role seeding completed\n");
}

async function seedPermissions() {
  console.log("\n=== Starting Permission Seeding ===");
  await seedPermissionsBootstrap();
  console.log("✅ Permission seeding completed\n");
}

async function seedBrands() {
  console.log("\n=== Starting Brand Seeding ===");
  await seedBrandsMain();
  console.log("✅ Brand seeding completed\n");
}

async function seedCategories() {
  console.log("\n=== Starting Category Seeding ===");
  await seedCategoriesMain();
  console.log("✅ Category seeding completed\n");
}

async function runAllSeeds() {
  try {
    console.log("========================================");
    console.log("Starting Database Seeding Process");
    console.log("========================================");

    // Run seeds one by one, catching individual errors
    try {
      await seedRoles();
    } catch (error) {
      console.error("⚠️ Error in role seeding (continuing...):", error instanceof Error ? error.message : error);
    }

    try {
      await seedPermissions();
    } catch (error) {
      console.error("⚠️ Error in permission seeding (continuing...):", error instanceof Error ? error.message : error);
    }

    try {
      await seedBrands();
    } catch (error) {
      console.error("⚠️ Error in brand seeding (continuing...):", error instanceof Error ? error.message : error);
    }

    try {
      await seedCategories();
    } catch (error) {
      console.error("⚠️ Error in category seeding (continuing...):", error instanceof Error ? error.message : error);
    }

    console.log("========================================");
    console.log("✅ All seeds completed!");
    console.log("========================================");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal error during seeding process:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run all seeds
void runAllSeeds();
