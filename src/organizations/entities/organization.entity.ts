import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  bio: string;

  @Column('jsonb')
  address: {
    street: string;
    city: string;
    country: string;
    zipcode: string;
  };

  @Column()
  repName: string;

  @Column()
  repContact: number;

  @OneToMany(() => User, (user) => user.organization)
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  convertToLowerCase() {
    const name = this.name.toLocaleLowerCase();
    this.name = name;
  }
}
