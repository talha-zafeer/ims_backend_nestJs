import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { Role } from "src/role/entity/role.entity";
import { Organization } from "src/organizations/entities/organization.entity";
import { Complaint } from "src/complaints/entities/complaint.entity";
import { Exclude } from "class-transformer";

import { PasswordReset } from "src/password-reset/entities/password-reset.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(["email"])
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  contact: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToOne(() => Organization, (org) => org.user)
  org: Organization;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaint: Complaint;

  @OneToMany(() => PasswordReset, (passwordReset) => passwordReset.user)
  passwordResets: PasswordReset[];
}
