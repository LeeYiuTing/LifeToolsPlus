import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { AssetEntity } from '@app/entities/asset.entity';

// enum TagType {
//
// }

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @Column()
  // type!: TagType;

  @Column()
  name!: string;

  @ManyToOne('UserEntity', 'tags')
  user!: UserEntity;

  @Column()
  userId!: string;

  @Column({ type: 'uuid', comment: 'The new renamed tagId', nullable: true })
  renameTagId!: string | null;

  @ManyToMany('AssetEntity', 'tags')
  assets!: AssetEntity[];
}
