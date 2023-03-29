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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(["email"])
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToOne(() => Organization, (org) => org.user)
  organization: Organization;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaint: Complaint;

  @Column({ nullable: true })
  otp: number;
}
