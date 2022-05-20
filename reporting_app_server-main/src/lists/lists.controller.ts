import { Controller, Get, Post, Body, Res, Delete, Put , HttpException , HttpStatus , Query, Param, UseGuards} from '@nestjs/common';
import { ListService } from './lists.service';
import { Response } from 'express';
import { List } from 'src/entities/lists.entity';
import { ListDto } from './interfaces/list.tdo';
import { GlobalGuard } from 'src/guards/global.guard';

@Controller('api/v1/lists')
@UseGuards(GlobalGuard)
export class ListsController {
    constructor(private readonly listService: ListService) {}

    @Get()
    findAll(@Query('filter') filter : string) {
        try {
           const { userId } = JSON.parse(filter)
           console.log(userId)
           return this.listService.findAll(userId);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }

    @Get(':id')
    async findOneList(@Param('id') id : number , @Res() res: Response ): Promise<Response> {
        try {
            const list =  await this.listService.findOneList(id);
            return res.status(HttpStatus.OK).json(list);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }

    @Post('create')
    async createList( @Body() listDto : ListDto , @Res() res: Response): Promise<Response> {
        try {
            await this.listService.insertList(listDto);
            return res.status(HttpStatus.OK).json({message: 'Lists Created'});
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, 400);
        }
    }

    @Delete('delete')
    async deleteList(@Query('filter') filter : string, @Res() res: Response): Promise<Response> {
       try {
        const ids = JSON.parse(filter).ids
        await this.listService.deleteList(ids);
        return res.status(HttpStatus.OK).json({message: 'Lists Deleted'});
       } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, 400);
       }
    }

    @Put('update/:id')
    async updateList(@Param('id') id: number, @Body() body: List, @Res() res: Response): Promise<Response> {
       try {
        await this.listService.updateList(id, {...body});
        return res.status(HttpStatus.OK).json({message: 'Lists Updated'});
       } catch (error) {
        throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
        }, 400); 
       }
    }
}
