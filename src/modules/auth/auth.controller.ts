/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInUserDto } from '../user/dto/signin-user.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Realiza o login de um usuário',
    description: 'Realiza o login de um usuário plataforma',
  })
  @ApiOkResponse({ description: 'Usuário logado com sucesso', status: 200 })
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400 })
  @ApiUnauthorizedResponse({
    description: 'Acesso não autorizado',
    status: 401,
  })
  signIn(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Acessa as informações de um usuário',
    description:
      'Acessa as informações de um usuário com base no Bearer Token recebido no login',
  })
  @ApiOkResponse({ description: 'Informações encontradas', status: 200 })
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400 })
  @ApiUnauthorizedResponse({
    description: 'Acesso não autorizado',
    status: 401,
  })
  getProfile(@Request() req) {
    const user = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      password: req.user.password,
      role: req.user.role,
    };
    return user;
  }
}
