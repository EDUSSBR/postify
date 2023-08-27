import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/database/prisma.service';
import { CreatePublicationDto } from './dtos/publications.dtos';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPublication({ mediaId, postId, date }) {
    await this.prisma.publications.create({ data: { mediaId, postId, date } });
  }
  async getPublications() {
    return await this.prisma.publications.findMany();
  }
  async getPublication(id: number) {
    return await this.prisma.publications.findUnique({ where: { id } });
  }
  async updatePublication({ id, mediaId, postId, date }: CreatePublicationDto) {
    await this.prisma.publications.update({
      where: { id },
      data: { mediaId, postId, date },
    });
  }
  async deletePublication(id: number) {
    await this.prisma.publications.delete({
      where: { id },
    });
  }
}
