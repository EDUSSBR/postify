import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  id?: number;
  @IsString()
  title: string;
  @IsString()
  text: string;
  @IsOptional()
  @IsUrl({}, { message: 'Should be a valid image url' })
  image?: string;
}
