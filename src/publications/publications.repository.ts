import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPublication({ title, username }) {
    await this.prisma.publications.create({ data: { title, username } });
  }
  async getPublicationByUsernameAndTitle({ title, username }) {
    return await this.prisma.publications.findFirst({
      where: { title, username },
    });
  }
  async getPublications() {
    return await this.prisma.publications.findMany();
  }
  async getPublication(id: number) {
    return await this.prisma.publications.findUnique({ where: { id } });
  }
  async updatePublication({ id, username, title }) {
    await this.prisma.publications.update({
      where: { id },
      data: { title, username },
    });
  }
  async deletePublication(id: number) {
    await this.prisma.publications.delete({
      where: { id },
    });
  }
}
