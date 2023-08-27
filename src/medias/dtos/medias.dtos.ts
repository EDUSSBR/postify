import { IsString } from 'class-validator';

export class CreateMediaDto {
  id?: string;
  @IsString()
  title: string;
  @IsString()
  username: string;
}
