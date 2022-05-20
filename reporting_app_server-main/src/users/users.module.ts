import {Module} from '@nestjs/common';
import { AuthUsersController } from './auth.users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { AuthIp } from 'src/entities/authIp.entity';
import { AuthIpsService } from 'src/authorized/auth_ips.service';
import { Team } from 'src/entities/teams.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User , UserRepository, AuthIp , Team])],
  controllers: [AuthUsersController,UsersController],
  providers: [UsersService , AuthIpsService],
})
export class AuthModule {}
