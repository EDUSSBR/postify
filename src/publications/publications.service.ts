import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
  ) {}
  async createPublications({ title, username }) {
    const PublicationsExists =
      await this.publicationsRepository.getPublicationsByUsernameAndTitle({
        title,
        username,
      });
    if (PublicationsExists) {
      throw new ConflictException();
    }
    await this.publicationsRepository.createPublications({
      title,
      username,
    });
  }
  async getPublications() {
    return this.formatPublications(
      await this.publicationsRepository.getPublications(),
    );
  }
  async getPublication(id: number) {
    const Publications = await this.publicationsRepository.getPublications(id);
    if (Publications) {
      return this.formatPublications(Publications);
    }
    throw new NotFoundException();
  }
  async updatePublication({ id, username, title }) {
    const Publications = await this.publicationsRepository.getPublications(id);
    if (!Publications) {
      throw new NotFoundException();
    }
    const PublicationsExists =
      await this.publicationsRepository.getPublicationsByUsernameAndTitle({
        username,
        title,
      });
    if (PublicationsExists) {
      throw new ConflictException();
    }
    await this.publicationsRepository.updatePublications({
      id,
      username,
      title,
    });
  }
  async deletePublication(id: number) {
    const Publications = await this.publicationsRepository.getPublications(id);
    if (!Publications) {
      throw new NotFoundException();
    }
    //PUBLICATIONS RULES HERE TODO
    await this.publicationsRepository.deletePublications(id);
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
