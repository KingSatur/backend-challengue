import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request';
import { ServiceResponse, ServiceResponseNotification } from '../shared/dto';
import { LoginResponsetDto } from './dto/login-response';
import { OperationMessage } from '../constants/exception.message';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async create(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<ServiceResponse<LoginResponsetDto>> {
    return new ServiceResponse(
      true,
      new ServiceResponseNotification(
        HttpStatus.OK,
        OperationMessage.AUTH_SUCCESS.message,
        OperationMessage.AUTH_SUCCESS.code,
      ),
      await this.authService.login(loginRequest),
    );
  }
}
