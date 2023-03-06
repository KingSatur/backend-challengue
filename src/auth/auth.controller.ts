import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request';
import { ServiceResponse, ServiceResponseNotification } from '../shared/dto';
import { LoginResponseDto } from './dto/login-response';
import { OperationMessage } from '../constants/exception.message';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenApiSpecRideSystemResponse } from '../shared/decorators/open-api-decorator';

@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @OpenApiSpecRideSystemResponse({ model: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Login with the use credentials',
  })
  public async create(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<ServiceResponse<LoginResponseDto>> {
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
