import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { MediasModule } from './medias/medias.module';
import { PublicationsModule } from './publications/publications.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PostsModule, MediasModule, PublicationsModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
