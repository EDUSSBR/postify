import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
