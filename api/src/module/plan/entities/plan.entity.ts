import { Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { User } from "../../user/entities/user.entity.js";

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @OneToMany(() => User,(user) => user.plan)
  users!: Relation<User>[]
}
