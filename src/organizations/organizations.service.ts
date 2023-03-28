import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}
  async create(createOrganizationDto: CreateOrganizationDto) {
    const organization = this.organizationRepo.create({
      ...createOrganizationDto,
    });

    return await this.organizationRepo.save(organization);
  }

  async findAll() {
    return await this.organizationRepo.find();
  }

  async findOne(name: string) {
    console.log(name);
    return await this.organizationRepo.findOneBy({ name });
  }

  async update(id: number, updateOrganization: UpdateOrganizationDto) {
    const organization = await this.organizationRepo.findOneBy({ id });

    if (!organization) {
      throw new NotFoundException({ message: 'Organization does not exist' });
    }

    Object.assign(organization, updateOrganization);

    return await this.organizationRepo.save(organization);
  }

  async remove(id: number) {
    const organization = await this.organizationRepo.findOneBy({ id });

    if (!organization) {
      throw new NotFoundException({ message: 'Organization does not exist' });
    }

    return await this.organizationRepo.delete(id);
  }
}
