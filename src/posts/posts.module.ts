import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';

@Module({
  exports: [PostsRepository],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
