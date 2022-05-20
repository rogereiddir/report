import {IsDefined , IsNotEmpty, IsOptional, IsString} from "class-validator";



export class TeamDto {

    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly name: string;
  
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly code: string;
  
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly  alias: string;

    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly  status: string;

}
