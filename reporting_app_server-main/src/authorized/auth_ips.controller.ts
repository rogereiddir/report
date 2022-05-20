import { Controller, Get, Post, Body, Res, Delete, Put , Param, Query, UseGuards } from '@nestjs/common';
import { AuthIpsService } from './auth_ips.service';
import { Response } from 'express';
import { AuthIp } from 'src/entities/authIp.entity';
import { AuthIpDto } from './interfaces/auth_ips.dto';
import { AdminGuard } from 'src/guards/users.guard';

@Controller('api/v1/ips')
@UseGuards(AdminGuard)
export class authIpsController {
    constructor(private readonly authIpsService: AuthIpsService) {}
    @Get()
    findAll() : Promise<AuthIp[]>{
      return this.authIpsService.findAllIPS();
    }

    @Get(':id')
    findOneIP(@Param('id') id: number  ,  @Res() res: Response) : Promise<AuthIp>{
      return this.authIpsService.findOneIP(id);
    }

    @Post('create')
    async createIP(@Body() authDto : AuthIpDto , @Res() res: Response): Promise<Response> {
        await this.authIpsService.insertIP(authDto);
        return res.status(200).json({message: 'IP Created'});
    }
    @Delete('delete')
    async deleteIP(@Query('filter') filter : string, @Res() res: Response): Promise<Response> {
        const ids = JSON.parse(filter).ids
        await this.authIpsService.deleteIP(ids);
        return res.status(200).json({message: 'IP Deleted'});
    }
    @Put('update/:id')
    async updateIP(@Body('id') id: number, @Body() body: AuthIpDto, @Res() res: Response): Promise<Response> {
        await this.authIpsService.updateIP(id, body);
        return res.status(200).json({message: 'IP Deleted'});
    }
}
