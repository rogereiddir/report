import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from './app.redis.adapter';
import { join } from 'path';
import helmet from 'helmet';
// import { GlobalGuard } from './guards/global.guard';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname,'../images'))
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  // app.useGlobalGuards(new GlobalGuard())
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    transform:true
  }))
  app.use(helmet({
    contentSecurityPolicy :{
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`, 'fonts.googleapis.com'],
        fontSrc: [`'self'`, 'fonts.gstatic.com'],
        imgSrc: [`'self'`, 'data:'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    }
  }));
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5000);
}
bootstrap();
