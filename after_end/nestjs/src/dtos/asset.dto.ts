import { ApiProperty } from '@nestjs/swagger';
import { UploadFieldName } from '@app/interfaces/asset.interface';

export class CreateAssetDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  [UploadFieldName.ASSET_DATA]!: any;
}
