import { createZodDto } from "nestjs-zod";

import { WebhookPaymentBodySchema } from "src/routes/payment/models/payment.model";

export class WebhookPaymentBodyDTO extends createZodDto(WebhookPaymentBodySchema) {}
