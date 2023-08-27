import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { MediasModule } from './medias/medias.module';
import { PublicationsModule } from './publications/publications.module';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { PrismaModule } from './database/prisma.module';
import { PublicationsController } from './publications/publications.controller';
import { MediasController } from './medias/medias.controller';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PublicationsService } from './publications/publications.service';
import { MediasService } from './medias/medias.service';
import { MediasRepository } from './medias/medias.repository';
import { PostsRepository } from './posts/posts.repository';
import { PublicationsRepository } from './publications/publications.repository';

@Module({
  imports: [
    PostsModule,
    MediasModule,
    PublicationsModule,
    HealthModule,
    PrismaModule,
  ],
  controllers: [
    HealthController,
    PostsController,
    PublicationsController,
    MediasController,
  ],
  providers: [
    HealthService,
    PostsService,
    PublicationsService,
    MediasService,
    MediasRepository,
    PostsRepository,
    PublicationsRepository,
  ],
})
export class AppModule {}
