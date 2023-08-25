import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}

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
    return this.formatMedia(await this.mediasRepository.getMedias());
  }
  async getMedia(id: number) {
    const media = await this.mediasRepository.getMedia(id);
    if (media) {
      return this.formatMedia(media);
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
    await this.mediasRepository.deleteMedia(id);
  }
  formatMedia(media) {
    if (Array.isArray(media)) {
      return media.map((item) => ({
        id: item.id,
        title: item.title,
        username: item.username,
      }));
    }
    return [{ id: media.id, title: media.title, username: media.username }];
  }
}
