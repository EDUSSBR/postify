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
import { CreatePostDto } from './dtos/posts.dtos';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  //a testar
  @Post()
  async createPosts(@Body() body: CreatePostDto) {
    await this.postsService.createPost(body);
    return 'Created';
  }
  //a testar
  @Get()
  async getPosts() {
    return await this.postsService.getPosts();
  }
  //a testar
  @Get(':id')
  async getPost(@Param('id') id: string) {
    return await this.postsService.getPost(parseInt(id));
  }
  //a testar
  @Put(':id')
  async updatePosts(@Param('id') id: string, @Body() body: CreatePostDto) {
    return this.postsService.updatePost({ id: parseInt(id), ...body });
  }
  //a testar
  @Delete(':id')
  async deletePosts(@Param('id') id: string) {
    return this.postsService.deletePost(parseInt(id));
  }
}
