import { Controller, Post, Body } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ZodResponse } from "nestjs-zod";
import { Auth } from "src/shared/decorators/auth.decorator";
import { WebhookPaymentBodyDTO } from "src/routes/payment/dto/payment.dto";
import { MessageResDto } from "src/shared/dtos/response.dto";
import { ApiSecurity } from "@nestjs/swagger";

@Controller("payment")
@ApiSecurity("payment-api-key")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("/receiver")
  @ZodResponse({ type: MessageResDto })
  @Auth(["PaymentAPIKey"])
  receiver(@Body() body: WebhookPaymentBodyDTO) {
    return this.paymentService.receiver(body);
  }
}
