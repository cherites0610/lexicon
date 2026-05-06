import { ApiProperty } from '@nestjs/swagger';

export class UploadUrlDto {
  @ApiProperty({ example: 'my-avatar.jpg', description: '檔案名稱' })
  fileName!: string;

  @ApiProperty({ example: 'image/jpeg', description: '檔案格式 (MIME Type)' })
  mimeType!: string;

  @ApiProperty({
    example: 'avatars',
    required: false,
    description: '存放資料夾',
  })
  folder?: string;
}
