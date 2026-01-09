import { Controller, Get, Post, Body, Req, Res, Render } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './auth-request.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {} // ✅ must be `private readonly authService`


  // Show login page
  @Get('login')
  @Render('auth/login') // path relative to views/
  loginPage() {
    return { layout: false };
  }

  

  @Post('login')
  async login(@Body() body: any, @Req() req: AuthRequest, @Res() res: Response) {
    const { email, password } = body;
    console.log('--- DEBUG: POST /auth/login ---');
    console.log('Body:', body);

    //process.exit(0);

    console.log('AuthController: POST /auth/login with body:', body);

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      console.log('AuthController: Login failed for email:', email);
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    // Store user in session
    req.session.user = user;
    console.log('AuthController: User stored in session:', req.session.user);


    await new Promise<void>((resolve, reject) => {
      req.session.save(err => (err ? reject(err) : resolve()));
    });
  
    console.log('✅ Session saved:', req.session.user);

    return res.redirect('/tasks');
    
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    (req as any).logout(() => {
      res.redirect('/');
    });
  }

}
