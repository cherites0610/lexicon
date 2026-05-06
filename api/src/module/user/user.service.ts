import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity.js";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async getMe(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { plan: true }
    })

    if (!user) {
      throw new NotFoundException("找不到用戶");
    }

    return user;
  }
}
