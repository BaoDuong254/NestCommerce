import path from "path";
import { registerEnumType } from "@nestjs/graphql";

export const UPLOAD_DIR = path.resolve("upload");
export const ALL_LANGUAGE_CODE = "all";

export const OrderBy = {
  Asc: "asc",
  Desc: "desc",
} as const;

export const SortBy = {
  Price: "price",
  CreatedAt: "createdAt",
  Sale: "sale",
} as const;

export enum OrderByEnum {
  Asc = "asc",
  Desc = "desc",
}

export enum SortByEnum {
  Price = "price",
  CreatedAt = "createdAt",
  Sale = "sale",
}

registerEnumType(OrderByEnum, {
  name: "OrderBy",
  description: "Order direction for sorting",
});

registerEnumType(SortByEnum, {
  name: "SortBy",
  description: "Field to sort by",
});

export const PREFIX_PAYMENT_CODE = "DH";

export type OrderByType = (typeof OrderBy)[keyof typeof OrderBy];
export type SortByType = (typeof SortBy)[keyof typeof SortBy];
