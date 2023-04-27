import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { User } from "src/user/entity/user.entity";

@Entity()
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  otp: string;

  @Column()
  createdAt: Date;

  @Column()
  expirationTime: Date;

  @ManyToOne(() => User, (user) => user.passwordResets)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;
}
