import { Entity, Column, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn , ManyToOne } from 'typeorm';
import { Process } from './process.entity';
import { Seed } from './seeds.entity';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp with time zone', { nullable:true , default: () => "NULL"  })
  start: Date;

  @Column('timestamp with time zone', { nullable:true , default: () => "NULL"  })
  end: Date;

  @ManyToOne(() => Seed, seed => seed.results , {onDelete:'CASCADE'})
  seed: Seed;

  @ManyToOne(() => Process, process => process.results ,{onDelete:'CASCADE'})
  process:Process

  @Column('text' , { default : "" })
  feedback: string;

  @Column('varchar' , { length: 250, default : "idle" })
  status: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
