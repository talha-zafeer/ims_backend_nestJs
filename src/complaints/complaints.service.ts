import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";
import { Complaint } from "./entities/complaint.entity";

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintsRepo: Repository<Complaint>
  ) {}

  async create(currentUser, createComplaintDto: CreateComplaintDto) {
    const user = currentUser.id;
    const complaint = this.complaintsRepo.create({
      ...createComplaintDto,
      user,
    });

    return await this.complaintsRepo.save(complaint);
  }

  async findAll() {
    return await this.complaintsRepo.find();
  }

  async findOne(id: number) {
    return this.complaintsRepo.findOneBy({ id });
  }

  async findAllByUser(userId: number) {
    return await this.complaintsRepo
      .createQueryBuilder("complaint")
      .innerJoinAndSelect("complaint.user", "user")
      .where("user.id = :userId", { userId })
      .getMany();
  }

  async update(id: number, updateComplaintDto: UpdateComplaintDto) {
    const complaint = await this.complaintsRepo.findOneBy({ id });
    console.log(complaint);

    if (!complaint) throw new NotFoundException();

    Object.assign(complaint, updateComplaintDto);
    console.log(complaint);

    return await this.complaintsRepo.save(complaint);
  }

  remove(id: number) {
    return `This action removes a #${id} complaint`;
  }
}
