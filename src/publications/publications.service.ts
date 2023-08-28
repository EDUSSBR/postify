import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PublicationsRepository } from './publications.repository';
import { MediasRepository } from '../../src/medias/medias.repository';
import { PostsRepository } from '../../src/posts/posts.repository';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
    private readonly mediasRepository: MediasRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async createPublications({ mediaId, postId, date }) {
    const [mediaExists, postExists] = await Promise.all([
      this.mediasRepository.getMedia(mediaId),
      this.postsRepository.getPost(postId),
    ]);
    if (!mediaExists || !postExists) {
      throw new NotFoundException();
    }
    await this.publicationsRepository.createPublication({
      mediaId,
      postId,
      date,
    });
  }
  async getPublications() {
    return await this.publicationsRepository.getPublications();
  }
  async getPublication(id: number) {
    const Publications = await this.publicationsRepository.getPublication(id);
    if (!Publications) {
      throw new NotFoundException();
    }
    return [Publications];
  }
  async updatePublication({ id, mediaId, postId, date }) {
    const Publications = await this.publicationsRepository.getPublication(id);
    if (!Publications) {
      throw new NotFoundException();
    }
    if (new Date(Publications.date) < new Date()) {
      throw new ForbiddenException();
    }
    const [mediaExists, postExists] = await Promise.all([
      this.mediasRepository.getMedia(mediaId),
      this.postsRepository.getPost(postId),
    ]);
    if (!mediaExists || !postExists) {
      throw new NotFoundException();
    }

    await this.publicationsRepository.updatePublication({
      id,
      mediaId,
      postId,
      date,
    });
  }
  async deletePublication(id: number) {
    const Publications = await this.publicationsRepository.getPublication(id);
    if (!Publications) {
      throw new NotFoundException();
    }
    await this.publicationsRepository.deletePublication(id);
  }
  formatPublications(Publications) {
    if (Array.isArray(Publications)) {
      return Publications.map((item) => ({
        id: item.id,
        title: item.title,
        username: item.username,
      }));
    }
    return [
      {
        id: Publications.id,
        title: Publications.title,
        username: Publications.username,
      },
    ];
  }
}
