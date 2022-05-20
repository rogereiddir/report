import {IsDefined , IsNumber , IsIP , IsNotEmpty, IsString, IsOptional} from "class-validator";
import { Team } from "src/entities/teams.entity";


export class AuthIpDto {
  
    @IsDefined()
    @IsNotEmpty()
    @IsIP()
    readonly ip: string;
  
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly entity: Team;
  
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly  type: string;

    @IsOptional()
    @IsString()
    readonly  note: string;
    
}
