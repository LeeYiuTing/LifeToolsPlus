import { ApiProperty } from '@nestjs/swagger';
import { UploadFieldName } from '@app/interfaces/asset.interface';
import { ValidateDate, Optional } from '@app/validation';
import { IsString } from 'class-validator';

export class CreateAssetDto {

  @ValidateDate()
  fileCreatedAt!: Date;

  @ValidateDate()
  fileModifiedAt!: Date;

  @Optional()
  @IsString()
  duration?: string;

  // API文档所需
  @ApiProperty({ type: 'string', format: 'binary' })
  [UploadFieldName.ASSET_DATA]!: any;
}
