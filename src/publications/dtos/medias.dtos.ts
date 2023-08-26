import { IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  title: string;
  @IsString()
  username: string;
}
