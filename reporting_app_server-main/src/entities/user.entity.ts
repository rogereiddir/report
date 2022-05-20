import {  Entity, Column, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn , BeforeInsert , BeforeUpdate, ManyToOne , OneToMany} from 'typeorm';
import { hashSync , genSaltSync } from 'bcryptjs';
import { Team } from './teams.entity';
import { List } from './lists.entity';
import { Process } from './process.entity';
import { Seed } from './seeds.entity';


@Entity('users')
export class User  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 , unique : true})
  username: string;

  @Column({ length: 250 , nullable:true})
  type: string;

  @Column({ length: 250 , select:false })
  password: string;

  @ManyToOne(() => Team, ent => ent.users , {onDelete:'CASCADE' , nullable:true })
  entity: Team;

  @Column({ length: 250 , default: "{null}" })
  access: string;

  @Column({ length: 250 })
  role: string;

  @Column({ default : "Active" })
  status: string;

  @OneToMany(type => List, list => list.user)
  lists:List[]

  @OneToMany(type => Seed, seed => seed.list)
  seeds: Seed[];

  @OneToMany(type => List, proc => proc.user)
  processes:Process[]

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @BeforeInsert()
  async generatePasswordHash(): Promise<void> {
    console.log('GENERATE');
    this.password = hashSync(this.password, genSaltSync(10));
  }

  @BeforeUpdate()
  async generatePasswordHash2(): Promise<void> {
    if(this.password){
      console.log('GENERATE UPDATE');
      this.password = hashSync(this.password, genSaltSync(10));
    }
  }
}
