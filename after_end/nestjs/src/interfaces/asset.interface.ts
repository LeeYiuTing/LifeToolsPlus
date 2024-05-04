import { AuthDto } from '@app/dtos/auth.dto';
import { AssetEntity } from '@app/entities/asset.entity';
import { Optional, ValidateDate } from '@app/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  OTHER = 'OTHER',
}

export enum UploadFieldName {
  ASSET_DATA = 'assetData',
  PROFILE_DATA = 'file',
}

export enum GetAssetThumbnailFormatEnum {
  JPEG = 'JPEG',
  WEBP = 'WEBP',
}

export interface UploadFiles {
  assetData: File[];
}

export interface UploadRequest {
  auth: AuthDto | null;
  fieldName: UploadFieldName;
  file: UploadFile;
}

export enum Route {
  ASSET = 'asset',
  USER = 'user',
}

export interface UploadFile {
  uuid: string;
  checksum: Buffer;
  originalPath: string;
  originalName: string;
  size: number;
}

export interface File extends Express.Multer.File {
  /** sha1 hash of file */
  uuid: string;
  checksum: Buffer;
}

export class AssetFileUploadResponseDto {
  id!: string;
  duplicate!: boolean;
}

export const IAssetRepository = 'IAssetRepository';

export interface IAssetRepository {
  create(asset: AssetCreate): Promise<AssetEntity>;
  getAllByUserId(userId: string, dto: AssetSearchDto): Promise<AssetEntity[]>;
}

export type AssetCreate = Pick<
  AssetEntity,
  | 'ownerId'
  | 'type'
  | 'originalPath'
  | 'fileCreatedAt'
  | 'localDateTime'
  | 'fileModifiedAt'
  | 'originalFileName'
> &
  Partial<AssetEntity>;

export class AssetSearchDto {
  @Optional()
  @IsUUID('4')
  @ApiProperty({ format: 'uuid' })
  userId?: string;

  @ValidateDate({ optional: true })
  updatedAfter?: Date;

  @ValidateDate({ optional: true })
  updatedBefore?: Date;
}

export class AssetResponseDto {
  id!: string;
  ownerId!: string;
  @ApiProperty({ enumName: 'AssetTypeEnum', enum: AssetType })
  type!: AssetType;
  resized!: boolean;
  localDateTime!: Date;
  duration!: string;
  originalPath!: string;
  originalFileName!: string;
  fileCreatedAt!: Date;
  fileModifiedAt!: Date;
  // tags?: TagResponseDto[]; // TODO
}
