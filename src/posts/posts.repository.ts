import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPost({ title, text, image }) {
    await this.prisma.posts.create({ data: { title, text, image } });
  }
  async getPosts() {
    return await this.prisma.posts.findMany();
  }
  async getPost(id: number) {
    return await this.prisma.posts.findUnique({ where: { id } });
  }
  async updatePost({ id, title, text, image }) {
    await this.prisma.posts.update({
      where: { id },
      data: { title, text, image },
    });
  }
  async deletePost(id: number) {
    await this.prisma.posts.delete({
      where: { id },
    });
  }
}
