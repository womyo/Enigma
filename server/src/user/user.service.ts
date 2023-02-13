import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserCredentialDto } from "./dto/user-credential.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async encryptPassword(user: UserCredentialDto): Promise<void> {
    const salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(user.password, salt);
    return Promise.resolve();
  }

  async signUp(userCredentialDto: UserCredentialDto): Promise<void> {
    await this.encryptPassword(userCredentialDto);

    try {
      await this.userRepository.save(userCredentialDto);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new ConflictException("Username exist");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    userCredentialDto: UserCredentialDto
  ): Promise<{ accessToken: string }> {
    const { username, password } = userCredentialDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 로그인시 유저 토큰 생성
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException("login failed");
    }
  }
}
