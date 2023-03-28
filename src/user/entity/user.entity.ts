import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
} from 'typeorm';

import { Role } from 'src/role/entity/role.entity';
import { Organization } from 'src/organizations/entities/organization.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToOne(() => Organization, (org) => org.user)
  organization: Organization;

  @Column({ nullable: true })
  otp: number;
}
