import { Controller , Post , Body , Get , Res , UseGuards , BadRequestException , Request as Reqo , Req } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { Request, Response } from 'express';
import * as crypto from 'crypto'
import { sign } from 'jsonwebtoken';
import { UserDto } from './interfaces/users.dto';
import { AdminGuard } from 'src/guards/users.guard';

@Controller('api/v1/auth/users')
export class AuthUsersController {
  constructor(
     private readonly authService: UsersService 
    ) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll(): Promise<User[]> {
   return this.authService.findAll();
  }

  @Post('logout')
  async logout(
    @Res() res: Response): Promise<Response> {
    try {
      res.clearCookie('reporting_access');
      res.clearCookie('jid_reporting_access');
      return res.status(200).json({
          status:200,
          message:"you are logged out !"
      });
    } catch (error) {
      throw new BadRequestException(error.detail || error.message ,"400");
    }
  }

  @Post('register')
  @UseGuards(AdminGuard)
  async register(@Body() userDto : UserDto , @Res() res: Response): Promise<Response> {
    try {
      const access = userDto.role === "IT" ? "{All}" : "{null}"
      await this.authService.insert({
        ...userDto,
        access
      });
      return res.status(200).json({ message: 'registred' });
    } catch (error) {
      throw new BadRequestException(error.detail || error.message ,"400");
    }
 }
 
 @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string ,@Reqo() req: Request , @Res() res: Response): Promise<Response> {
    try {
      console.log("remote", req.headers['x-forwarded-for'])
      const user = await this.authService.findOne(username);
      if (user) {
        const valid = await compare(password,user.password)
        if (!valid) {
          return res.status(401).json({message: 'Password not Correct'});
        }else{
          const Token  = sign({userId: user.id , entity:user.entity?.id ,  username: user.username , role: user.role}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
          });
          const accessToken = Token.split('.').slice(0, 2).join('.');
          const jid = Token.split('.').pop();
          res.cookie('reporting_access', accessToken);
          res.cookie('jid_reporting_access', jid , {
            httpOnly: true,
          });
          return res.status(200).json({success:"Logged in with success" , userId: user.id , entity:user.entity?.id , username: user.username , role: user.role});
        }
      }else{
        return res.status(401).json({ message: 'You are not authorized' });
      }
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }
}
