import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  async createPosts(@Body() body: CreatePostsDto) {
    await this.postsService.createPost(body);
    return 'Created';
  }
  @Get()
  async getPosts() {
    return await this.postsService.getPosts();
  }
  @Get(':id')
  async getPost(@Param('id') id: string) {
    return await this.postsService.getPosts(parseInt(id));
  }
  @Put(':id')
  async updatePosts(@Param('id') id: string, @Body() body: CreatePostsDto) {
    return this.postsService.updatePost({ id: parseInt(id), ...body });
  }
  @Delete(':id')
  async deletePosts(@Param('id') id: string) {
    return this.postsService.deletePost(parseInt(id));
  }
}
