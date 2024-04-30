import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from "typeorm";
import { TagEntity } from './tag.entity';

export enum UserStatus {
  ACTIVE = 'active',
  REMOVING = 'removing',
  DELETED = 'deleted',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: '' })
  name!: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @Column({ unique: true })
  email?: string;

  @Column({ type: 'varchar', unique: true, default: null })
  storageLabel!: string | null;

  @Column({ default: '', select: false })
  password?: string;

  @Column({ default: '' })
  oauthId!: string;

  @Column({ default: false })
  shouldChangePassword!: boolean;

  @Column({ default: true })
  memoriesEnabled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;

  @Column({ type: 'varchar', default: UserStatus.ACTIVE })
  status!: UserStatus;

  @OneToMany('TagEntity', 'user')
  tags!: TagEntity[];
}
