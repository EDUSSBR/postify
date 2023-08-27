import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Module({
  exports: [PostsRepository],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PublicationsRepository],
})
export class PostsModule {}
