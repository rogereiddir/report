import {IsDefined , IsNumber , IsString , IsNotEmpty , IsOptional} from "class-validator";
import { Team } from "src/entities/teams.entity";
import { User } from "src/entities/user.entity";
import { List } from "src/entities/lists.entity";


export class ProcessDto {

    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public name: string;
  
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly entity: Team;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly list: List;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly user: User;
  
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly  actions: string;

    readonly  file: string;
    
}


export class UpdateProcessDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly  actions?: string;

    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly  status: string;
    
}