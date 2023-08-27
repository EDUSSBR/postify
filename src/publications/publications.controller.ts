import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dtos/publications.dtos';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}
  //a testar
  @Post()
  async createPublications(@Body() body: CreatePublicationDto) {
    await this.publicationsService.createPublications(body);
    return 'Created';
  }
  //a testar
  @Get()
  async getPublications() {
    return await this.publicationsService.getPublications();
  }
  //a testar
  @Get(':id')
  async getPublication(@Param('id') id: string) {
    return await this.publicationsService.getPublication(parseInt(id));
  }
  //a testar
  @Put(':id')
  async updatePublication(
    @Param('id') id: string,
    @Body() body: CreatePublicationDto,
  ) {
    return this.publicationsService.updatePublication({
      id: parseInt(id),
      ...body,
    });
  }
  //a testar
  @Delete(':id')
  async deletePublication(@Param('id') id: string) {
    return this.publicationsService.deletePublication(parseInt(id));
  }
}
