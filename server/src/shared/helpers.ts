import { Prisma } from "generated/prisma";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Checks if the given error is a Prisma unique constraint violation error.
 * @param error - The error to check.
 * @returns True if the error is a unique constraint violation, false otherwise.
 */
export function isUniqueConstraintPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/**
 * Checks if the given error is a Prisma "not found" error.
 * @param error - The error to check.
 * @returns True if the error indicates a "not found" condition, false otherwise.
 */
export function isNotFoundPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

/**
 * Checks if the given error is a Prisma foreign key constraint violation error.
 * @param error - The error to check.
 * @returns True if the error is a foreign key constraint violation, false otherwise.
 */
export function isForeignKeyConstraintPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003";
}

/**
 * Generates a 6-digit One-Time Password (OTP).
 * @returns A string representing the generated OTP.
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generates a random filename with the same extension as the original filename.
 * @param filename - The original filename.
 * @returns A string representing the generated random filename.
 */
export const generateRandomFilename = (filename: string) => {
  const ext = path.extname(filename);
  return `${uuidv4()}${ext}`;
};
