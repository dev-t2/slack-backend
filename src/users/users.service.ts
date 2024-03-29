import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import { SignUpDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp({ email, nickname, password }: SignUpDto) {
    const isExistsEmail = await this.usersRepository.existsEmail(email);

    if (isExistsEmail) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');
    }

    const isExistsNickname = await this.usersRepository.existsNickname(nickname);

    if (isExistsNickname) {
      throw new UnauthorizedException('이미 존재하는 닉네임입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.signUp({ email, nickname, password: hashedPassword });
  }
}
