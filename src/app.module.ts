import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { ComplaintsModule } from "./complaints/complaints.module";
import { CategoriesModule } from "./categories/categories.module";
import { AwsModule } from "./aws/aws.module";

import { PasswordResetModule } from "./password-reset/password-reset.module";
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UserModule,
    RoleModule,
    OrganizationsModule,
    ComplaintsModule,
    CategoriesModule,
    AwsModule,
    PasswordResetModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
