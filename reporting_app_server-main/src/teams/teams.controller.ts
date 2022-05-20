import { Controller, Get, Post, Body, Res, Delete, Put, Param, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { TeamService } from './teams.service';
import { Response } from 'express';
import { TeamDto } from './interfaces/team.tdo';
import { Team } from 'src/entities/teams.entity';
import { AdminGuard } from 'src/guards/users.guard';

@Controller('api/v1/teams')
@UseGuards(AdminGuard)
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Get()
    findAll() {
      return this.teamService.findAllTeams();
    }

    @Post('create')
    async createTeam(@Body() teamDto : TeamDto, @Res() res: Response): Promise<Response> {
        await this.teamService.insertTeam(teamDto);
        return res.status(200).json({message: 'Team Created'});
    }

    @Delete('delete')
    async deleteTeam(@Query('filter') filter, @Res() res: Response): Promise<Response> {
       try {
        const { ids } = JSON.parse(filter)
        await this.teamService.deleteTeam(ids);
        return res.status(200).json({message: 'Team Deleted'});
       } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, 400);
       }
    }
    
    @Put('update/:id')
    async updateTeam(@Param('id') id: number, @Body() teamDto: Team, @Res() res: Response): Promise<Response> {
       try {
        await this.teamService.updateTeam(id, teamDto);
        return res.status(200).json({message: 'Team Updated'});
       } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, 400);
       }
    }
}
