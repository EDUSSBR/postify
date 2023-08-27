import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediasRepository } from './medias.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Module({
  exports: [MediasRepository],
  controllers: [MediasController],
  providers: [MediasService, MediasRepository, PublicationsRepository],
})
export class MediasModule {}
