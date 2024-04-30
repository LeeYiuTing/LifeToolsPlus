import { Injectable } from '@nestjs/common';
import { IAssetRepository } from '@app/interfaces/asset.interface';
import { AssetEntity } from '@app/entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class AssetRepository implements IAssetRepository {
  constructor(
    @InjectRepository(AssetEntity) private repository: Repository<AssetEntity>,
  ) {}

  create(asset) {
    return this.repository.save(asset);
  }
}
