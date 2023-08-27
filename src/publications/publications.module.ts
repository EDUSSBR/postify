import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { PublicationsRepository } from './publications.repository';
import { MediasRepository } from '../../src/medias/medias.repository';
import { PostsRepository } from '../../src/posts/posts.repository';
@Module({
  controllers: [PublicationsController],
  providers: [
    PublicationsService,
    PublicationsRepository,
    MediasRepository,
    PostsRepository,
  ],
})
export class PublicationsModule {}
