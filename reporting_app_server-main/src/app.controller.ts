import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { resolve } from 'path';

@Controller()
export class AppController {

  @Get('/app/*')
  getApp(@Res() res : Response) {
    return res.sendFile(resolve(__dirname,'..' , 'build','index.html'))
  }

}
