import { Prisma } from "generated/prisma";

/**
 * Checks if the given error is a Prisma unique constraint violation error.
 * @param error - The error to check.
 * @returns True if the error is a unique constraint violation, false otherwise.
 */
export function isUniqueConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/**
 * Checks if the given error is a Prisma "not found" error.
 * @param error - The error to check.
 * @returns True if the error indicates a "not found" condition, false otherwise.
 */
export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

/**
 * Checks if the given error is a Prisma foreign key constraint violation error.
 * @param error - The error to check.
 * @returns True if the error is a foreign key constraint violation, false otherwise.
 */
export function isForeignKeyConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003";
}

/**
 * Generates a 6-digit One-Time Password (OTP).
 * @returns A string representing the generated OTP.
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
