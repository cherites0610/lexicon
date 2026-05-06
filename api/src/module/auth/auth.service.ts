import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from 'google-auth-library';
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { JwtPayload } from "../../common/type/jwt-payload.js";

@Injectable()
export class AuthService {
  private readonly client: OAuth2Client

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    this.client = new OAuth2Client(
      configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      configService.getOrThrow<string>('GOOGLE_CALLBACK_URL')
    )
  }

  getGoogleLoginURL() {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    })
  }

  handlerGoogleLoginCallback = async (code: string) => {
    console.log(1);
    try {
      const { tokens } = await this.client.getToken(code)
      this.client.setCredentials(tokens)
      console.log(2);

      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID')
      })
      console.log(3);

      const payload = ticket.getPayload();
      if (!payload) throw new BadRequestException('非法Google Token')

      const { sub: googleId, email, name } = payload;
      console.log(4);

      let user = await this.userRepository.findOneBy({ googleId })

      if (!user) {
        user = this.userRepository.create({
          googleId,
          googleEmail: email,
          googleName: name
        })
        user = await this.userRepository.save(user, { reload: true })
      }

      return this.issueToken(user)
    } catch (err) {
      console.log(err);

    }

  }

  issueToken = (user: User) => {
    const uuid = randomUUID()
    const payload: JwtPayload = {
      jti: uuid,
      sub: user.id,
      email: user.googleEmail
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
