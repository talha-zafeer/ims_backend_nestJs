import { Module } from "@nestjs/common";
import * as AWS from "aws-sdk";

@Module({
  providers: [
    {
      provide: "S3",
      useFactory: () => {
        const s3Config = {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_BUCKET_REGION,
        };
        return new AWS.S3(s3Config);
      },
    },
  ],
  exports: ["S3"],
})
export class AwsModule {}
