import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TagEntity } from '@app/entities/tag.entity';
import { AssetType } from '@app/interfaces/asset.interface';

@Entity('assets')
export class AssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ownerId!: string;

  @Column({
    type: "enum",
    enum: AssetType,
    default: AssetType.OTHER,
  })
  type!: AssetType;

  @Column()
  originalPath!: string;

  @Column({ type: 'varchar', nullable: true })
  previewPath!: string | null;

  @Column({ type: 'varchar', nullable: true, default: '' })
  thumbnailPath!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @Column()
  fileCreatedAt!: Date;

  @Column()
  localDateTime!: Date;

  @Column()
  fileModifiedAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  duration!: string | null;

  @Column({ type: 'varchar' })
  originalFileName!: string;

  @ManyToMany(() => TagEntity, (tag) => tag.assets, { cascade: true })
  // @JoinTable({ name: 'tag_asset', synchronize: false })
  tags!: TagEntity[];

  // TODO
  // jobStatus?:
}
