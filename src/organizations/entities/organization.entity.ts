import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/user/entity/user.entity";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  bio: string;

  @Column({ nullable: true })
  logo: string;

  @Column("jsonb")
  address: {
    street: string;
    city: string;
    country: string;
    zipcode: string;
  };

  @Column()
  rep_name: string;

  @Column()
  rep_contact: string;

  @OneToMany(() => User, (user) => user.org)
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  convertToLowerCase() {
    const name = this.name.toLocaleLowerCase();
    this.name = name;
  }
}
