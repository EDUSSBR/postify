import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dtos/posts.dtos';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  //regra de negocio ok
  async createPost({ title, text, image }: CreatePostDto) {
    await this.postsRepository.createPost({
      title,
      text,
      image,
    });
  }
  //regra de negocio ok
  async getPosts() {
    return await this.postsRepository.getPosts();
  }
  //regra de negocio ok
  async getPost(id: number) {
    const Post = await this.postsRepository.getPost(id);
    if (!Post) {
      throw new NotFoundException();
    }
    return Post;
  }
  //regra de negocio ok
  async updatePost({ id, title, text, image }: CreatePostDto) {
    const Post = await this.postsRepository.getPost(id);
    if (!Post) {
      throw new NotFoundException();
    }
    await this.postsRepository.updatePost({ id, title, text, image });
  }
  //deixar por ultimo semi ok a regra de negocio
  //falta ver se tem publicação agendada
  async deletePost(id: number) {
    const Post = await this.postsRepository.getPost(id);
    if (!Post) {
      throw new NotFoundException();
    }
    //PUBLICATIONS RULES HERE TODO
    await this.postsRepository.deletePost(id);
  }
  formatPost(posts) {
    if (Array.isArray(posts)) {
      return posts.map((item) => ({
        id: item.id,
        title: item.title,
        text: item.text,
        image: item.image,
      }));
    }
    return [{ id: posts.id, title: posts.title, username: posts.username }];
  }
}
