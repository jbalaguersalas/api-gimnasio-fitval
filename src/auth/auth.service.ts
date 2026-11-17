import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const hash = await argon2.hash(dto.password);
    return this.usersService.create(dto.email, hash);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    const ok = user && (await argon2.verify(user.password_hash, dto.password));
    if (!user || !ok) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const payload: JwtPayload = { sub: user.id };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
