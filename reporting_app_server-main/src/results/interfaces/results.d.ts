import { Process } from "src/entities/process.entity";
import { Seed } from "src/entities/seeds.entity";


export class ResultDto {

    readonly start?: string;
    
    readonly end?: string;

    readonly process?: Process;

    readonly seed?: Seed;

    readonly status?: string;

    readonly feedback?: string;

}
