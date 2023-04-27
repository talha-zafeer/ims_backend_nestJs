import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { S3 } from "aws-sdk";
import { Repository } from "typeorm";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { Organization } from "./entities/organization.entity";
import { Image } from "aws-sdk/clients/iotanalytics";

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @Inject("S3") private readonly s3: S3
  ) {}
  async create(createOrganizationDto: CreateOrganizationDto, logo: any) {
    const uploadImage = await this.s3
      .upload({
        Bucket: "gigalabs-ams-bucket",
        Key: logo.originalname,
        Body: logo.buffer,
      })
      .promise();
    const organization = this.organizationRepo.create({
      ...createOrganizationDto,
      logo: uploadImage.Key,
    });

    return await this.organizationRepo.save(organization);
  }

  async findAll() {
    const organizations = await this.organizationRepo.find();
    console.log(organizations);

    return Promise.all(
      organizations.map(async (org) => {
        const s3Object = await this.s3
          .getObject({ Bucket: "gigalabs-ams-bucket", Key: org.logo })
          .promise();
        const logoBase64 = (s3Object.Body as Buffer).toString(
          "base64"
        ) as string;
        return { ...org, logo: logoBase64 };
      })
    );
  }

  async findOne(name: string) {
    const org = await this.organizationRepo.findOneBy({ name });
  }

  async update(id: number, updateOrganization: UpdateOrganizationDto) {
    const organization = await this.organizationRepo.findOneBy({ id });

    if (!organization) {
      throw new NotFoundException({ message: "Organization does not exist" });
    }

    Object.assign(organization, updateOrganization);

    return await this.organizationRepo.save(organization);
  }

  async remove(id: number) {
    const organization = await this.organizationRepo.findOneBy({ id });

    if (!organization) {
      throw new NotFoundException({ message: "Organization does not exist" });
    }

    return await this.organizationRepo.delete(id);
  }
}
