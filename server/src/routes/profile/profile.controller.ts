import { Body, Controller, Get, Patch } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import { ChangePasswordBodyDto, UpdateMeBodyDto } from "src/routes/profile/dto/profile.dto";
import { ProfileService } from "src/routes/profile/profile.service";
import { ActiveUser } from "src/shared/decorators/active-user.decorator";
import { MessageResDto } from "src/shared/dtos/response.dto";
import { GetUserProfileResDto, UpdateProfileResDto } from "src/shared/dtos/shared-user.dto";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodResponse({ type: GetUserProfileResDto })
  getProfile(@ActiveUser("userId") userId: number) {
    return this.profileService.getProfile(userId);
  }

  @Patch()
  @ZodResponse({ type: UpdateProfileResDto })
  updateProfile(@Body() body: UpdateMeBodyDto, @ActiveUser("userId") userId: number) {
    return this.profileService.updateProfile({
      userId,
      body,
    });
  }

  @Patch("change-password")
  @ZodResponse({ type: MessageResDto })
  changePassword(@Body() body: ChangePasswordBodyDto, @ActiveUser("userId") userId: number) {
    return this.profileService.changePassword({
      userId,
      body,
    });
  }
}
