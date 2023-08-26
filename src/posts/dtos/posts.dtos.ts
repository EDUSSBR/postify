import { IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  text: string;
  @IsUrl({}, { message: 'Should be a valid image url' })
  image?: string;
}
