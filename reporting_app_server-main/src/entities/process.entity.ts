import { Entity, Column, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn , ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { List } from './lists.entity';
import { Result } from './results.entity';

@Entity('processes')
export class Process {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  name: string;

  @ManyToOne(() => User, user => user.processes , {onDelete:'CASCADE'})
  user: User;

  @ManyToOne(() => List, list => list.processes , {onDelete:'CASCADE'})
  list: List;

  @Column('bigint' , { default : null , nullable:true })
  jobId: number;

  @Column('varchar' , { length: 500 })
  actions: string;

  @OneToMany(() => Result , res => res.process , {onUpdate:'CASCADE' , onDelete:'CASCADE'})
  results:Result[]
  
  @Column('varchar' , { length: 250, default : "idle" })
  status: string;

  @Column('varchar' , { length: 250, default : "" })
  file: string;

  @Column('boolean' , { default : true })
  active: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
