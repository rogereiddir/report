import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class GlobalGuard implements CanActivate {

  canActivate(context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {
    try {
        const request : Request = context.switchToHttp().getRequest();
        const accessToken = request.cookies.reporting_access;
        const jid = request.cookies.jid_reporting_access;
        const decoded = verify(`${accessToken}.${jid}`,  process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded)
        if (decoded) {
          return true;
        }
        return false;
    } catch(err) {
      console.log(err)
      return false;
    }
  }
}
