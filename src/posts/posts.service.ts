import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  async createPost({ title, username }) {
    const PostExists = await this.postsRepository.getPostByUsernameAndTitle({
      title,
      username,
    });
    if (PostExists) {
      throw new ConflictException();
    }
    await this.postsRepository.createPost({
      title,
      username,
    });
  }
  async getPosts() {
    return this.formatPost(await this.PostsRepository.getPosts());
  }
  async getPost(id: number) {
    const Post = await this.PostsRepository.getPost(id);
    if (Post) {
      return this.formatPost(Post);
    }
    throw new NotFoundException();
  }
  async updatePost({ id, username, title }) {
    const Post = await this.PostsRepository.getPost(id);
    if (!Post) {
      throw new NotFoundException();
    }
    const PostExists = await this.PostsRepository.getPostByUsernameAndTitle({
      username,
      title,
    });
    if (PostExists) {
      throw new ConflictException();
    }
    await this.PostsRepository.updatePost({ id, username, title });
  }
  async deletePost(id: number) {
    const Post = await this.PostsRepository.getPost(id);
    if (!Post) {
      throw new NotFoundException();
    }
    //PUBLICATIONS RULES HERE TODO
    await this.PostsRepository.deletePost(id);
  }
  formatPost(Post) {
    if (Array.isArray(Post)) {
      return Post.map((item) => ({
        id: item.id,
        title: item.title,
        username: item.username,
      }));
    }
    return [{ id: Post.id, title: Post.title, username: Post.username }];
  }
}
