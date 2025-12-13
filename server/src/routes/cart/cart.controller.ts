import { Controller, Get, Post, Body, Param, Put, Query } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ActiveUser } from "src/shared/decorators/active-user.decorator";
import {
  AddToCartBodyDTO,
  CartItemDTO,
  DeleteCartBodyDTO,
  GetCartItemParamsDTO,
  GetCartResDTO,
  UpdateCartItemBodyDTO,
} from "src/routes/cart/dto/cart.dto";
import { PaginationQueryDto } from "src/shared/dtos/request.dto";
import { ZodSerializerDto } from "nestjs-zod";
import { MessageResDto } from "src/shared/dtos/response.dto";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ZodSerializerDto(GetCartResDTO)
  getCart(@ActiveUser("userId") userId: number, @Query() query: PaginationQueryDto) {
    return this.cartService.getCart(userId, query);
  }

  @Post()
  @ZodSerializerDto(CartItemDTO)
  addToCart(@Body() body: AddToCartBodyDTO, @ActiveUser("userId") userId: number) {
    return this.cartService.addToCart(userId, body);
  }

  @Put(":cartItemId")
  @ZodSerializerDto(CartItemDTO)
  updateCartItem(
    @ActiveUser("userId") userId: number,
    @Param() param: GetCartItemParamsDTO,
    @Body() body: UpdateCartItemBodyDTO
  ) {
    return this.cartService.updateCartItem({
      userId,
      cartItemId: param.cartItemId,
      body,
    });
  }

  @Post("delete")
  @ZodSerializerDto(MessageResDto)
  deleteCart(@Body() body: DeleteCartBodyDTO, @ActiveUser("userId") userId: number) {
    return this.cartService.deleteCart(userId, body);
  }
}
