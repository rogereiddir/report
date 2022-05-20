import { Team } from "src/entities/teams.entity";
import { User } from "src/entities/user.entity";
import { IsDefined  , IsNotEmpty , IsNumber  } from "class-validator";


export class ListDto {

    readonly name?: string;

    readonly isp?: string;
  
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly entity?: Team;

    readonly count?: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    readonly user?: User;
    
    readonly  status?: string;

}
