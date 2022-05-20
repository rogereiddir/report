import { Entity, Column, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn , ManyToOne , OneToMany } from 'typeorm';
import { Team } from './teams.entity';
import { User } from './user.entity';
import { Process } from './process.entity';
import { Seed } from './seeds.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  name: string;

  @Column('varchar' , { length: 250 })
  isp: string;

  @ManyToOne(type => User, user => user.lists , {onDelete:'CASCADE'})
  user: User;

  @ManyToOne(type => Team, ent => ent.lists ,  {onDelete:'CASCADE'})
  entity: Team;

  @OneToMany(type => Seed, seed => seed.list)
  seeds: Seed[];
  
  @Column('int' ,{ default: 0 })
  count: number;

  @Column('varchar' ,{ length: 250 , default:"Active" })
  status: string;

  @OneToMany(type => Process, comp => comp.list)
  processes:Process[]

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
