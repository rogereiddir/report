import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthIpsService } from 'src/authorized/auth_ips.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private service : AuthIpsService) {}
  async use(req: Request, res: Response, next: Function) {
    const remote = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    const ips =  await this.service.findIps()
    if(ips.find(ip => ip.ip === remote)){
      next()
    }else{
      if(process.env.NODE_ENV === 'production'){
         return res.status(403).end('forbidden 403')
      }
      next()
    }
  }
}
