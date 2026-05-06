import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Plan } from "../../plan/entities/plan.entity.js";

@Entity("user")
@Index(['id', 'googleId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { name: 'google_id', unique: true })
  googleId!: string

  @Column('varchar', { name: 'google_email', unique: true })
  googleEmail!: string

  @Column('varchar', { name: 'google_name' })
  googleName!: string

  @Column({ name: 'plan_id', nullable: true })
  planId!: string

  @ManyToOne(() => Plan, (plan) => plan.users)
  @JoinColumn({ name: 'plan_id' })
  plan!: Relation<Plan>
}
