import { Authenticated, GetLoginDetails, PublicRoute } from '@app/middleware/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService, LoginDetails } from '@app/services/auth.service';
import { LoginCredentialDto, LoginResponseDto } from '@app/dtos/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
@Authenticated()
export class AuthController {
  constructor(private service: AuthService) {}

  @PublicRoute()
  @Post('login')
  async login(
    @Body() loginCredential: LoginCredentialDto,
    @Res({ passthrough: true }) res: Response,
    @GetLoginDetails() loginDetails: LoginDetails,
  ): Promise<LoginResponseDto> {
    const { response } = await this.service.login(loginCredential, loginDetails);
    // res.header('Set-Cookie', cookie);
    return response;
  }
}
