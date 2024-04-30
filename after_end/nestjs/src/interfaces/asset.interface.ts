import { AuthDto } from '@app/dtos/auth.dto';
import { AssetEntity } from '@app/entities/asset.entity';

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
  create(asset): Promise<AssetEntity>;
}
