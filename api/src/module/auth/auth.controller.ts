import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { Public } from "../../common/decorator/public.decorator.js";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:AuthService
  ) {}

  @Public()
  @Get('login-url')
  getGoogleLoginURL() {
    return this.authService.getGoogleLoginURL()
  }

  @Public()
  @Post('google/callback')
  handlerGoogleLoginCallBack(@Body('code') code: string) {
    return this.authService.handlerGoogleLoginCallback(code)
  }
}
