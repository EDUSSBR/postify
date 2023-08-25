import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createMedia({ title, username }) {
    await this.prisma.medias.create({ data: { title, username } });
  }
  async getMediaByUsernameAndTitle({ title, username }) {
    return await this.prisma.medias.findFirst({ where: { title, username } });
  }
  async getMedias() {
    return await this.prisma.medias.findMany();
  }
  async getMedia(id: number) {
    return await this.prisma.medias.findUnique({ where: { id } });
  }
  async updateMedia({ id, username, title }) {
    await this.prisma.medias.update({
      where: { id },
      data: { title, username },
    });
  }
  async deleteMedia(id: number) {
    await this.prisma.medias.delete({
      where: { id },
    });
  }
}
