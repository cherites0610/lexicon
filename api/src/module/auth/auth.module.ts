import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity.js";
import { Plan } from "../plan/entities/plan.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([User,Plan])],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
