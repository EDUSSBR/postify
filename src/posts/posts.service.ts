import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dtos/posts.dtos';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly publicationsRepository: PublicationsRepository,
  ) {}
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
    return (await this.postsRepository.getPosts()).map((post) =>
      post.image ? post : { text: post.text, title: post.title, id: post.id },
    );
  }
  //regra de negocio ok
  async getPost(id: number) {
    const post = await this.postsRepository.getPost(id);
    if (!post) {
      throw new NotFoundException();
    }
    return post.image
      ? post
      : { text: post.text, title: post.title, id: post.id };
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
    const existsPublicationsWithThisPost =
      await this.publicationsRepository.getPublicationByPostId(id);
    if (existsPublicationsWithThisPost) {
      throw new ForbiddenException();
    }
    await this.postsRepository.deletePost(id);
  }
}
