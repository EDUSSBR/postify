import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediasRepository } from './medias.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class MediasService {
  constructor(
    private readonly mediasRepository: MediasRepository,
    private readonly publicationsRepository: PublicationsRepository,
  ) {}

  async createMedia({ title, username }) {
    const mediaExists = await this.mediasRepository.getMediaByUsernameAndTitle({
      title,
      username,
    });
    if (mediaExists) {
      throw new ConflictException();
    }
    await this.mediasRepository.createMedia({
      title,
      username,
    });
  }
  async getMedias() {
    return await this.mediasRepository.getMedias();
  }
  async getMedia(id: number) {
    const media = await this.mediasRepository.getMedia(id);
    if (media) {
      return media;
    }
    throw new NotFoundException();
  }
  async updateMedia({ id, username, title }) {
    const media = await this.mediasRepository.getMedia(id);
    if (!media) {
      throw new NotFoundException();
    }
    const mediaExists = await this.mediasRepository.getMediaByUsernameAndTitle({
      username,
      title,
    });
    if (mediaExists) {
      throw new ConflictException();
    }
    await this.mediasRepository.updateMedia({ id, username, title });
  }
  async deleteMedia(id: number) {
    const media = await this.mediasRepository.getMedia(id);
    if (!media) {
      throw new NotFoundException();
    }
    //PUBLICATIONS RULES HERE TODO
    const existsPublicationsWithThisMedia =
      await this.publicationsRepository.getPublicationByMediaId(id);
    if (existsPublicationsWithThisMedia) {
      throw new ForbiddenException();
    }
    await this.mediasRepository.deleteMedia(id);
  }
}
