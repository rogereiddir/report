import { Length , IsNotEmpty  ,IsNumber  , IsDefined, IsString, IsOptional, IsObject } from "class-validator";
import { Team } from "src/entities/teams.entity";



export class UserDto {
    
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly loginu: string;
  
    @IsDefined()
    @IsNotEmpty()
    @Length(9)
    public password: string;
  
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly entity: Team;
    
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly role: string;

    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly access: string;
}

export class UpdateStatus {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly status: string;

}