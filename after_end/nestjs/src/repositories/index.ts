import { ICryptoRepository } from '@app/interfaces/crypto.interface';
import { ISystemConfigRepository } from '@app/interfaces/system-config.interface';
import { IEventRepository } from '@app/interfaces/event.interface';
import { IUserRepository } from '@app/interfaces/user.interface';
import { IUserTokenRepository } from '@app/interfaces/user-token.interface';

import { CryptoRepository } from './crypto.repository';
import { SystemConfigRepository } from './system-config.repository';
// import {  } from './tag.respositort';
import { UserRepository } from './user.repository';
import { UserTokenRepository } from '@app/repositories/user-token.repository';
import { EventRepository } from '@app/repositories/event.repository';

export const repositories = [
  { provide: ICryptoRepository, useClass: CryptoRepository },
  { provide: ISystemConfigRepository, useClass: SystemConfigRepository },
  { provide: IEventRepository, useClass: EventRepository },
  { provide: IUserRepository, useClass: UserRepository },
  { provide: IUserTokenRepository, useClass: UserTokenRepository }
]