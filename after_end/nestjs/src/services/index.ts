import { SystemConfigService } from './system-config.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AssetService } from './asset.service';

export const services = [
  SystemConfigService,
  ApiService,
  AuthService,
  UserService,
  AssetService
];
