import { Team } from "src/entities/teams.entity";
import { User } from "src/entities/user.entity";
import {IsDefined , IsNumber, IsEmail , IsNotEmpty, IsString, IsOptional} from "class-validator";
import { List } from "src/entities/lists.entity";


export class SeedDto {

    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly verificationemail?: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly isp?: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly proxy?: string;
  
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly entity?: Team;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly list?: List;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly user?: User;

    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly status?: string;

    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly feedback?: string;


}
