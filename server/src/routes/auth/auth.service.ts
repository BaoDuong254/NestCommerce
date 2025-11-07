import { ConflictException, Injectable } from "@nestjs/common";
import { AuthRepository } from "src/routes/auth/auth.repo";
import { RegisterBodyType } from "src/routes/auth/models/auth.model";
import { RolesService } from "src/routes/auth/roles.service";
import { isUniqueConstraintPrismaError } from "src/shared/helpers";
import { HashingService } from "src/shared/services/hashing.service";
import { TokenService } from "src/shared/services/token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const clientRoleID = await this.rolesService.getClientRoleID();
      const hashedPassword = await this.hashingService.hash(body.password);
      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleID,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException("Email already in use");
      }
      throw error;
    }
  }
}
