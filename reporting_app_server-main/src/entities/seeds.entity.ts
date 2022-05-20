import { Entity, Column, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn , ManyToOne , OneToMany} from 'typeorm';
import { Team } from './teams.entity';
import { List } from './lists.entity';
import { Result } from './results.entity';

@Entity('seeds')
export class Seed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 , unique:true })
  email: string;

  @Column('varchar' , {length: 250})
  password: string;

  @Column('varchar' , { length: 250 })
  isp: string;

  @Column('varchar' , { length: 500 })
  proxy: string;

  @Column('varchar' , { length: 500 ,nullable:true , default:null })
  verificationemail: string;

  @ManyToOne(() => Team, ent => ent.seeds , {onDelete:'CASCADE'})
  entity: Team;

  @ManyToOne(() => List, list => list.seeds  , {onDelete:'CASCADE'})
  list: List;

  @OneToMany(() => Result , res => res.seed  , {onUpdate:'CASCADE' , onDelete:'CASCADE'})
  results:Result[]
  
  @Column('varchar' , { default : "idle"})
  status: string;

  @Column('varchar' , { default : ""})
  feedback: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
