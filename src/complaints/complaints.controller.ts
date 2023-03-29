import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/guards/jwt.auth.guard";
import { ComplaintsService } from "./complaints.service";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";

@Controller("complaints")
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() currentUser: any,
    @Body() createComplaintDto: CreateComplaintDto
  ) {
    return this.complaintsService.create(currentUser, createComplaintDto);
  }

  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  @Get("user/:id")
  findAllByUser(@Param("id") id: number) {
    return this.complaintsService.findAllByUser(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.complaintsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateComplaintDto: UpdateComplaintDto
  ) {
    return this.complaintsService.update(+id, updateComplaintDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.complaintsService.remove(+id);
  }
}
