import { UserController } from '@app/controllers/user.controller';
import { SystemConfigController } from '@app/controllers/system-config.controller';
import { AuthController } from '@app/controllers/auth.controller';

export const controllers = [
  UserController,
  SystemConfigController,
  AuthController
];
