import { NestFactory } from "@nestjs/core";
import { Application } from "express";
import { AppModule } from "src/app.module";
import { HTTPMethod } from "src/shared/constants/http.constant";
import { RoleName } from "src/shared/constants/role.constant";
import { PrismaService } from "src/shared/services/prisma.service";

interface RouteLayer {
  route?: {
    path: string;
    stack: Array<{ method: string }>;
  };
}

interface AvailableRoute {
  path: string;
  method: keyof typeof HTTPMethod;
  name: string;
  module: string;
}

const SellerModule = ["AUTH", "MEDIA", "MANAGE-PRODUCT", "PRODUCT-TRANSLATION", "PROFILE", "CART", "ORDERS", "REVIEWS"];
const ClientModule = ["AUTH", "MEDIA", "PROFILE", "CART", "ORDERS", "REVIEWS"];
const prisma = new PrismaService();

export default async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  const server = app.getHttpAdapter().getInstance() as Application;
  const router = server.router;
  const permissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  const availableRoutes: AvailableRoute[] = (router.stack as RouteLayer[])
    .map((layer: RouteLayer) => {
      if (layer.route) {
        const path: string = layer.route.path;
        const method: keyof typeof HTTPMethod = String(
          layer.route.stack[0].method
        ).toUpperCase() as keyof typeof HTTPMethod;
        const moduleName: string = String(path.split("/")[1]).toUpperCase();
        return {
          path,
          method,
          name: method + " " + path,
          module: moduleName,
        };
      }
    })
    .filter((item): item is AvailableRoute => item !== undefined);

  // Create object permissionInDbMap with key [method-path]
  const permissionInDbMap: Record<string, (typeof permissionsInDb)[0]> = permissionsInDb.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;
    return acc;
  }, {});

  // Create object availableRoutesMap with key [method-path]
  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;
    return acc;
  }, {});

  // Find permissions that are not in available routes
  const permissionsToDelete = permissionsInDb.filter((item) => {
    return !availableRoutesMap[`${item.method}-${item.path}`];
  });

  // Delete permissions that are not in available routes
  if (permissionsToDelete.length > 0) {
    const deleteResult = await prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionsToDelete.map((item) => item.id),
        },
      },
    });
    console.log("Deleted permissions:", deleteResult.count);
  } else {
    console.log("No permissions to delete");
  }

  // Find routes that are not in the database
  const routesToAdd = availableRoutes.filter((item) => {
    return !permissionInDbMap[`${item.method}-${item.path}`];
  });

  // Add new permissions
  if (routesToAdd.length > 0) {
    const permissionsToAdd = await prisma.permission.createMany({
      data: routesToAdd,
      skipDuplicates: true,
    });
    console.log("Added permissions:", permissionsToAdd.count);
  } else {
    console.log("No permissions to add");
  }

  // Get updated permissions from database
  const updatedPermissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });
  const adminPermissionIds = updatedPermissionsInDb.map((item) => ({ id: item.id }));
  const sellerPermissionIds = updatedPermissionsInDb
    .filter((item) => SellerModule.includes(item.module))
    .map((item) => ({ id: item.id }));
  const clientPermissionIds = updatedPermissionsInDb
    .filter((item) => ClientModule.includes(item.module))
    .map((item) => ({ id: item.id }));

  await Promise.all([
    updateRole(adminPermissionIds, RoleName.Admin),
    updateRole(sellerPermissionIds, RoleName.Seller),
    updateRole(clientPermissionIds, RoleName.Client),
  ]);
  if (require.main === module) {
    process.exit(0);
  }
}

const updateRole = async (permissionIds: { id: number }[], roleName: string) => {
  // Update permissions for the role
  const role = await prisma.role.findFirstOrThrow({
    where: {
      name: roleName,
      deletedAt: null,
    },
  });

  await prisma.role.update({
    where: {
      id: role.id,
    },
    data: {
      permissions: {
        set: permissionIds,
      },
    },
  });
};

if (require.main === module) {
  void bootstrap();
}
