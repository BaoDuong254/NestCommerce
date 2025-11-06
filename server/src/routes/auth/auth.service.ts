import { ConflictException, Injectable } from "@nestjs/common";
import { RegisterBodyDto } from "src/routes/auth/dto/auth.dto";
import { RolesService } from "src/routes/auth/roles.service";
import { isUniqueConstraintPrismaError } from "src/shared/helpers";
import { HashingService } from "src/shared/services/hashing.service";
import { PrismaService } from "src/shared/services/prisma.service";
import { TokenService } from "src/shared/services/token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService
  ) {}

  async register(body: RegisterBodyDto) {
    try {
      const clientRoleID = await this.rolesService.getClientRoleID();
      const hashedPassword = await this.hashingService.hash(body.password);
      const newUser = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          phoneNumber: body.phoneNumber,
          roleId: clientRoleID,
        },
        omit: {
          password: true,
          totpSecret: true,
        },
      });
      return newUser;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException("Email already in use");
      }
      throw error;
    }
  }
}
