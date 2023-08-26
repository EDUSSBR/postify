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

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}
  @Post()
  async createPublications(@Body() body: CreatePublicationsDto) {
    await this.publicationsService.createPublications(body);
    return 'Created';
  }
  @Get()
  async getPublications() {
    return await this.publicationsService.getPublications();
  }
  @Get(':id')
  async getPublication(@Param('id') id: string) {
    return await this.publicationsService.getPublication(parseInt(id));
  }
  @Put(':id')
  async updatePublication(
    @Param('id') id: string,
    @Body() body: CreatePublicationsDto,
  ) {
    return this.publicationsService.updatePublication({
      id: parseInt(id),
      ...body,
    });
  }
  @Delete(':id')
  async deletePublication(@Param('id') id: string) {
    return this.publicationsService.deletePublication(parseInt(id));
  }
}
