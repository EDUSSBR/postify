import { IsISO8601, IsNumber, IsOptional } from 'class-validator';

export class CreatePublicationDto {
  @IsOptional()
  id?: number;
  @IsNumber()
  mediaId: number;
  @IsNumber()
  postId: number;
  @IsISO8601()
  date: Date;
}
