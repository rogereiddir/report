import { Module, Global } from '@nestjs/common';
import { authIpsController } from './auth_ips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthIpsService } from './auth_ips.service';
import { AuthIp } from 'src/entities/authIp.entity';
import { AuthIpRepository } from './auth_ips.repository';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AuthIp ,AuthIpRepository])],
    controllers: [authIpsController],
    providers: [AuthIpsService],
})
export class authIpsModule {}
