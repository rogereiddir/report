import { Entity, Column, PrimaryGeneratedColumn , UpdateDateColumn , CreateDateColumn  , ManyToOne } from 'typeorm';
import { Team } from './teams.entity';

@Entity('authorizedips')
export class AuthIp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar' , { length: 250 , nullable : false })
  ip: string;

  @ManyToOne(type => Team, team => team.ips ,  {onDelete:'CASCADE'})
  entity: Team;

  @Column('varchar'  ,{ length: 250 })
  type: string;

  @Column('varchar',{ default :"Active" , length: 250})
  status: string;

  @Column('varchar' , { length: 250 , default:"" })
  note: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

}
