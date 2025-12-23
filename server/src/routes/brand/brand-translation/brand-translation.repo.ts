import { Injectable } from "@nestjs/common";
import {
  GetBrandTranslationDetailResType,
  CreateBrandTranslationBodyType,
  BrandTranslationType,
  UpdateBrandTranslationBodyType,
} from "src/routes/brand/brand-translation/models/brand-translation.model";
import { SerializeAll } from "src/shared/decorators/serialize.decorator";
import { PrismaService } from "src/shared/services/prisma.service";

@Injectable()
@SerializeAll()
export class BrandTranslationRepo {
  constructor(private prismaService: PrismaService) {}

  findById(id: number): Promise<GetBrandTranslationDetailResType | null> {
    return this.prismaService.brandTranslation.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    }) as unknown as Promise<GetBrandTranslationDetailResType | null>;
  }

  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateBrandTranslationBodyType;
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.create({
      data: {
        ...data,
        createdById,
      },
    }) as unknown as Promise<BrandTranslationType>;
  }

  update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number;
    data: UpdateBrandTranslationBodyType;
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
    }) as unknown as Promise<BrandTranslationType>;
  }

  delete(
    {
      id,
      deletedById,
    }: {
      id: number;
      deletedById: number;
    },
    isHard?: boolean
  ): Promise<BrandTranslationType> {
    return isHard
      ? (this.prismaService.brandTranslation.delete({
          where: {
            id,
          },
        }) as unknown as Promise<BrandTranslationType>)
      : (this.prismaService.brandTranslation.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
            deletedById,
          },
        }) as unknown as Promise<BrandTranslationType>);
  }
}
