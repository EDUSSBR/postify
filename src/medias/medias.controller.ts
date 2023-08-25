import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dtos/medias.dtos';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}
  @Post()
  async createMedia(@Body() body: CreateMediaDto) {
    await this.mediasService.createMedia(body);
    return 'Created';
  }
  @Get()
  async getMedias() {
    return await this.mediasService.getMedias();
  }
  @Get(':id')
  async getMedia(@Param('id') id: string) {
    return await this.mediasService.getMedia(parseInt(id));
  }
  @Put(':id')
  async updateMedia(@Param('id') id: string, @Body() body: CreateMediaDto) {
    return this.mediasService.updateMedia({ id: parseInt(id), ...body });
  }
  @Delete(':id')
  async deleteMedia(@Param('id') id: string) {
    return this.mediasService.deleteMedia(parseInt(id));
  }
}
