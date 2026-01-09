import { Body, Controller, Get, Post, Render, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './dto/create-user.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthRequest } from '../auth/auth-request.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ GET /users
  @Get()
  async getUsers() {
    return this.usersService.findAll();
  }

  // POST /users/createuser
  @Post('createuser')
  @ApiBody({ type: CreateUser }) // Swagger request body
  async createUser(@Body() createUser: CreateUser) {
    return this.usersService.create(createUser);
  }

  // Show profile form
  @UseGuards(AuthGuard('session'))
  @Get('profile')
  @Render('users/profile')
  showProfile(@Req() req: AuthRequest) {
    console.log('USER FROM SESSION 👉', req.user);
    console.log('===== SESSION OBJECT =====');
    console.log(req.session);
    return {
      user: req.session.user,
    };
  }

  

  @Post('profile/update')
  async updateProfile(
    @Req() req: AuthRequest,
    @Body() body: any,
  ) {
    await this.usersService.updateProfile(req.session.user.id, body);
    return { success: true };
  }
}
