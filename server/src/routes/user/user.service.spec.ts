import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { UserRepo } from "./user.repo";
import { HashingService } from "src/shared/services/hashing.service";
import { SharedUserRepository } from "src/shared/repositories/shared-user.repo";
import { SharedRoleRepository } from "src/shared/repositories/shared-role.repo";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepo,
          useValue: {
            list: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: SharedUserRepository,
          useValue: {
            findUniqueIncludeRolePermissions: jest.fn(),
          },
        },
        {
          provide: SharedRoleRepository,
          useValue: {
            findUnique: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
