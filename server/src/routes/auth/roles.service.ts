import { PrismaService } from "src/shared/services/prisma.service";
import { Injectable } from "@nestjs/common";
import { RoleName } from "src/shared/constants/role.constant";

@Injectable()
export class RolesService {
  private clientRoleID: number | null = null;

  constructor(private readonly prismaService: PrismaService) {}

  async getClientRoleID(): Promise<number> {
    if (this.clientRoleID) {
      return this.clientRoleID;
    }

    const clientRole = await this.prismaService.role.findUniqueOrThrow({
      where: {
        name: RoleName.Client,
      },
    });

    if (!clientRole) {
      throw new Error("Client role not found in the database.");
    }

    this.clientRoleID = clientRole.id;

    return this.clientRoleID;
  }
}
