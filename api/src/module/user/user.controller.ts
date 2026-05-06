import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { CurrentUser } from "../../common/decorator/current-user.decorator.js";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get('me')
  async getMe(@CurrentUser('id') id: string) {
    return await this.userService.getMe(id)
  }
}
