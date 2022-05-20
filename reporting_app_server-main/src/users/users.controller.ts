import { Controller , Post , Body , Get , Res , UseGuards , BadRequestException , HttpStatus, Logger, Put, Param, Delete, Query, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { Response } from 'express';
import { UpdateStatus, UserDto } from './interfaces/users.dto';
import { createHash } from 'crypto';
import { AdminGuard } from 'src/guards/users.guard';

@Controller('api/v1/users')
@UseGuards(AdminGuard)
export class UsersController {
  constructor(private readonly authService: UsersService ) {}

  @Get()
  findAll(): Promise<User[]> {
   return this.authService.findAll();
  }

  
 @Post()
 async create(@Body() userDto : UserDto , @Res() res: Response): Promise<Response> {
   try {
     userDto.password = createHash('md5').update(userDto.password).digest("hex");
     await this.authService.insert(userDto);
     return res.status(200).json({ message: 'registred' });
   } catch (error) {
     throw new BadRequestException(error.detail || error.message , error.code);
   }
}


  @Put(':id')
  async update(@Param('id') id : number , @Body() userStatusDto : UpdateStatus , @Res() res: Response): Promise<Response> {
    try {
      await this.authService.updateStatus(id,userStatusDto);
      return res.status(200).json({ message: 'registred' });
    } catch (error) {
      throw new BadRequestException(error.detail || error.message ,"400");
    }
  }

  @Delete()
    async deleteTeam(@Query('filter') filter : string, @Res() res: Response): Promise<Response> {
       try {
        const { ids } = JSON.parse(filter)
        await this.authService.remove(ids);
        return res.status(200).json({message: 'Users Deleted'});
       } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, 400);
       }
    }

}
