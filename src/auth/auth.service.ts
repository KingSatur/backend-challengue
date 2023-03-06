import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response';
import { RideManagementException } from '../shared/exception/ride-management-exception';
import { ServiceResponseNotification } from '../shared/dto';
import { ExceptionMessage } from '../constants/exception.message';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = this.configService.get<number>('encrypt_ronds');
  }

  async login(loginDto: LoginRequestDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto?.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new RideManagementException(
        new ServiceResponseNotification(
          HttpStatus.UNAUTHORIZED,
          ExceptionMessage.INVALID_CREDENTIALS.message,
          ExceptionMessage.INVALID_CREDENTIALS.code,
        ),
      );
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto?.password,
      user?.password,
    );

    if (!isPasswordMatching) {
      throw new RideManagementException(
        new ServiceResponseNotification(
          HttpStatus.UNAUTHORIZED,
          ExceptionMessage.INVALID_CREDENTIALS.message,
          ExceptionMessage.INVALID_CREDENTIALS.code,
        ),
      );
    }

    const token = this.jwtService.sign(
      {
        id: user?.id,
      },
      {
        expiresIn: 30 * 24 * 60 * 60,
      },
    );

    return new LoginResponseDto(token);
  }
}
