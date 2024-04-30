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

@Entity('assets')
export class AssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  previewPath!: string | null;

  @Column({ type: 'varchar', nullable: true, default: '' })
  thumbnailPath!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @Column({ type: 'timestamptz' })
  fileCreatedAt!: Date;

  @Column({ type: 'timestamptz' })
  localDateTime!: Date;

  @Column({ type: 'timestamptz' })
  fileModifiedAt!: Date;

  @Column({ type: 'varchar' })
  originalFileName!: string;

  @ManyToMany(() => TagEntity, (tag) => tag.assets, { cascade: true })
  @JoinTable({ name: 'tag_asset', synchronize: false })
  tags!: TagEntity[];
}
