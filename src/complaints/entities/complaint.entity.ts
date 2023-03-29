import { User } from "src/user/entity/user.entity";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @CreateDateColumn()
  submission_date: Date;

  @Column()
  status: boolean;

  @ManyToOne(() => User, (user) => user.complaint)
  user: User;

  @BeforeInsert()
  complaintStatus() {
    this.status = false;
  }
}
