import { CacheModule, MiddlewareConsumer, Module, NestModule, OnModuleInit, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './users/users.module';
import { ProcessModule } from './processes/processes.module';
import { authIpsModule } from './authorized/auth_ips.module';
import { SeedModule } from './seeds/seeds.module';
import { ListModule } from './lists/lists.module';
import { TeamModule } from './teams/teams.module';
import { AppGateway } from './app.gateway';
import { ListService } from './lists/lists.service';
import { ProcessService } from './processes/processes.service';
import { join } from 'path';
import { Process } from './entities/process.entity';
import { List } from './entities/lists.entity';
import { AuthIp } from './entities/authIp.entity';
import { LoggerMiddleware } from './middleware/ip.middleware';
import { AuthIpsService } from './authorized/auth_ips.service';
import { User } from './entities/user.entity';
import { Result } from './entities/results.entity';
import { ResultsService } from './results/results.service';
import * as redisStore from 'cache-manager-redis-store';
import { Seed } from './entities/seeds.entity';
import { SeedService } from './seeds/seeds.service';
import { UsersService } from './users/users.service';
import { Team } from './entities/teams.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env'
    }),
    CacheModule.register({
      store:redisStore,
      host: 'localhost',
      port: 6379
   }),
    AuthModule,
    ProcessModule,
    SeedModule,
    ListModule,
    TeamModule,
    authIpsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username:process.env.DB_USER,
      password:  process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [  __dirname + '/entities/*.*.js' ],
      migrations: ['src/migrations/*.js'],
      migrationsTableName:"migrations",
      cli:{
        migrationsDir:"src/migrations",
        entitiesDir: "src/entities"
      }
    }),
    // TypeOrmModule.forRoot({
    //   name:'remoteConnection',
    //   type: 'postgres',
    //   host: process.env.REMOTE_DB_HOST,
    //   port: 5432,
    //   username: 'root',
    //   password: '',
    //   database: process.env.REMOTE_DB_NAME,
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','build'),
      renderPath:'/app',
      exclude: ['/api*'],
    }),
    TypeOrmModule.forFeature([List,Seed ,Process, AuthIp , User , Result , Team])
  ],
  controllers: [AppController],
  providers: [ AppService , ListService , ProcessService , AuthIpsService , ResultsService , SeedService , UsersService , AppGateway ],
})
export class AppModule implements NestModule , OnModuleInit {

  constructor(
    private readonly userService: UsersService 
   ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  onModuleInit() {
    console.log(`Initialization...`);
    // this.userService.seedsuperuser().then(()=>{
    //   console.log(`Admin User Initialized`);
    // })
  }
}