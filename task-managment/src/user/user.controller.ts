import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse } from '../tasks/dto/api-response';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name); // Logger instance

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(createUserDto);
      this.logger.log(`User registered: ${user.email}`);
      return res
        .status(HttpStatus.CREATED)
        .json(new ApiResponse('User created successfully', true, user));
    } catch (error) {
      this.logger.error(
        `Error registering user: ${createUserDto.email}`,
        error,
      );
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            'Error creating user',
            false,
            (error as Error).message,
          ),
        );
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      if (!user) {
        this.logger.warn(
          `Failed login attempt for email: ${loginUserDto.email}`,
        );
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(new ApiResponse('Invalid credentials', false, null));
      }
      const token = this.authService.login(user);
      this.logger.log(`User logged in: ${user.email}`);
      return res
        .status(HttpStatus.OK)
        .json(new ApiResponse('Login successful', true, token));
    } catch (error) {
      this.logger.error(`Error during login: ${loginUserDto.email}`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            'Error during login',
            false,
            error instanceof Error ? error.message : 'Unknown error',
          ),
        );
    }
  }
}
