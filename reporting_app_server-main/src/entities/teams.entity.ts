import { Entity, Column, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn , OneToMany } from 'typeorm';
import { User } from './user.entity';
import { List } from './lists.entity';
import { Seed } from './seeds.entity';
import { AuthIp } from './authIp.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar' , { length: 250 , unique: true })
  name: string;

  @Column('varchar' , { length: 250 , default:"" })
  code: string;

  @Column('varchar' , { length: 250 , default:"" })
  alias: string;

  @Column('varchar' , { length: 250 , default:"Active" })
  status: string;

  @OneToMany(type => AuthIp, authip => authip.entity)
  ips:AuthIp[]

  @OneToMany(type => User, user => user.entity)
  users:User[]

  @OneToMany(type => List, list => list.entity)
  lists:List[]

  @OneToMany(type => Seed, seed => seed.entity)
  seeds:Seed[]

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
