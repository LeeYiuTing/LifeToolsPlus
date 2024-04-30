import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { readFile } from 'node:fs/promises';
import { SystemConfigEntity } from '@app/entities/system-config.entity';
import { ISystemConfigRepository } from "@app/interfaces/system-config.interface";

export class SystemConfigRepository implements ISystemConfigRepository {
  constructor(
    @InjectRepository(SystemConfigEntity)
    private repository: Repository<SystemConfigEntity>,
  ) {}

  load(): Promise<SystemConfigEntity[]> {
    return this.repository.find();
  }

  readFile(filename: string): Promise<string> {
    return readFile(filename, { encoding: 'utf8' });
  }

  saveAll(items: SystemConfigEntity[]): Promise<SystemConfigEntity[]> {
    return this.repository.save(items);
  }

  async deleteKeys(keys: string[]): Promise<void> {
    await this.repository.delete({ key: In(keys) });
  }
}
