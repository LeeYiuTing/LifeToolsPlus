import { Injectable } from '@nestjs/common';
import { AssetCreate, AssetSearchDto, IAssetRepository } from '@app/interfaces/asset.interface';
import { AssetEntity } from '@app/entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionalBetween } from '@app/utils/database';


@Injectable()
export class AssetRepository implements IAssetRepository {
  constructor(
    @InjectRepository(AssetEntity) private repository: Repository<AssetEntity>,
  ) {}

  create(asset: AssetCreate): Promise<AssetEntity> {
    return this.repository.save(asset);
  }

  getAllByUserId(ownerId: string, dto: AssetSearchDto): Promise<AssetEntity[]> {
    return this.repository.find({
      where: {
        ownerId,
        updatedAt: OptionalBetween(dto.updatedAfter, dto.updatedBefore),
      },
      // relations: {
      //   tags: true,
      // },
      order: {
        fileCreatedAt: 'DESC',
      },
      withDeleted: true,
    });
  }
}
