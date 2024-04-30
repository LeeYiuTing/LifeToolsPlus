import { UserController } from '@app/controllers/user.controller';
import { SystemConfigController } from '@app/controllers/system-config.controller';
import { AuthController } from '@app/controllers/auth.controller';
import { AssetController } from '@app/controllers/asset.controller';

export const controllers = [
  UserController,
  SystemConfigController,
  AuthController,
  AssetController
];
