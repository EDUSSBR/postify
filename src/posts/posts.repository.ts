import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createPost({ title, username }) {
    await this.prisma.posts.create({ data: { title, username } });
  }
  async getPostByUsernameAndTitle({ title, username }) {
    return await this.prisma.posts.findFirst({ where: { title, username } });
  }
  async getPosts() {
    return await this.prisma.posts.findMany();
  }
  async getPost(id: number) {
    return await this.prisma.posts.findUnique({ where: { id } });
  }
  async updatePost({ id, username, title }) {
    await this.prisma.posts.update({
      where: { id },
      data: { title, username },
    });
  }
  async deletePost(id: number) {
    await this.prisma.posts.delete({
      where: { id },
    });
  }
}
