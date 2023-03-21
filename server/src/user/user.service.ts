import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { Repository, UpdateResult } from "typeorm";
import * as bcrypt from "bcryptjs";
import { UserDto } from "src/dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  /**
   * 유저 저장
   * @param userDto
   */
  async create(userDto: UserDto): Promise<void> {
    const user = this.userRepository.create(userDto);
    await this.userRepository.save(user);
  }

  /**
   * 이메일로 특정 유저 조회
   * @param email
   */
  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ email });
  }

  /**
   * 아이디로 특정 유저 조회
   * @param id
   */
  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * 아이디와 refreshToken으로 특정 유저 조회
   * @param id
   * @param refreshToken
   */
  async getUser(id: number, refreshToken: string): Promise<UserEntity> {
    const user = await this.findById(id);

    const isRefreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (isRefreshTokenMatch) {
      return user;
    }
  }

  /**
   * 유저의 refreshToken값을 암호화하여 DB의 refreshToken 컬럼 값을 갱신
   * @param id
   * @param refresToken
   */
  async setRefreshToken(id: number, refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt();

    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.userRepository.update(id, { refreshToken: hashedRefreshToken });
  }

  /**
   * 유저의 refreshToken 컬럼 값을 null로 갱신
   * @param id
   */
  async removeRefreshToken(id: number): Promise<UpdateResult> {
    return this.userRepository.update(id, { refreshToken: null });
  }
}
