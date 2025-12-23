import { z } from "zod";

export const PaymentTransactionSchema = z.object({
  id: z.number({ error: "Error.InvalidPaymentTransactionId" }),
  gateway: z.string({ error: "Error.InvalidGateway" }),
  transactionDate: z.iso.datetime({ error: "Error.InvalidTransactionDate" }),
  accountNumber: z.string({ error: "Error.InvalidAccountNumber" }).nullable(),
  subAccount: z.string({ error: "Error.InvalidSubAccount" }).nullable(),
  amountIn: z.number({ error: "Error.InvalidAmountIn" }),
  amountOut: z.number({ error: "Error.InvalidAmountOut" }),
  accumulated: z.number({ error: "Error.InvalidAccumulated" }),
  code: z.string({ error: "Error.InvalidCode" }).nullable(),
  transactionContent: z.string({ error: "Error.InvalidTransactionContent" }).nullable(),
  referenceNumber: z.string({ error: "Error.InvalidReferenceNumber" }).nullable(),
  body: z.string({ error: "Error.InvalidBody" }).nullable(),
  createdAt: z.iso.datetime({ error: "Error.InvalidCreatedAt" }),
});

/**
 * https://docs.sepay.vn/tich-hop-webhooks.html
 */
export const WebhookPaymentBodySchema = z.object({
  id: z.number({ error: "Error.InvalidId" }), // Transaction ID on SePay
  gateway: z.string({ error: "Error.InvalidGateway" }), // Bank brand name
  transactionDate: z.string({ error: "Error.InvalidTransactionDate" }), // Time of transaction on the bank side
  accountNumber: z.string({ error: "Error.InvalidAccountNumber" }).nullable(), // Bank account number
  code: z.string({ error: "Error.InvalidCode" }).nullable(), // Payment code (SePay auto-detects based on configuration at Company -> General Settings)
  content: z.string({ error: "Error.InvalidContent" }).nullable(), // Transfer content
  transferType: z.enum(["in", "out"], { error: "Error.InvalidTransferType" }), // Transaction type. 'in' is money in, 'out' is money out
  transferAmount: z.number({ error: "Error.InvalidTransferAmount" }), // Transaction amount
  accumulated: z.number({ error: "Error.InvalidAccumulated" }), // Account balance (accumulated)
  subAccount: z.string({ error: "Error.InvalidSubAccount" }).nullable(), // Subsidiary bank account (identification account)
  referenceCode: z.string({ error: "Error.InvalidReferenceCode" }).nullable(), // Reference code of the SMS message
  description: z.string({ error: "Error.InvalidDescription" }), // Full content of the SMS message
});

export type PaymentTransactionType = z.infer<typeof PaymentTransactionSchema>;
export type WebhookPaymentBodyType = z.infer<typeof WebhookPaymentBodySchema>;
