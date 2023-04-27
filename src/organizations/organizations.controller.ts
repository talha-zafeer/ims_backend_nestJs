import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post("create")
  @UseInterceptors(FileInterceptor("logo"))
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    return this.organizationsService.create(createOrganizationDto, logo);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get("name")
  findOne(@Query("name") name) {
    return this.organizationsService.findOne(name);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.organizationsService.remove(+id);
  }
}
