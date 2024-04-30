import { UserEntity } from '@app/entities/user.entity';
import { SystemConfig } from '@app/entities/system-config.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { IncomingHttpHeaders } from 'node:http';
import dayjs from 'dayjs'
import { ClientMetadata, Issuer, UserinfoResponse, custom, generators } from 'openid-client';
import cookieParser from 'cookie';
import { isString } from 'class-validator';

import { AuthType, LOGIN_URL } from '@app/constant';
import { Logger } from '@app/utils/logger';
import { UserCore } from '@app/cores/user.core';
import { SystemConfigCore } from '@app/cores/system-config.core';
import {
  AuthDto, LoginResponseDto, LoginCredentialDto, LogoutResponseDto,
  ChangePasswordDto, SignUpDto, mapLoginResponse, OAuthConfigDto, OAuthAuthorizeResponseDto, OAuthCallbackDto
} from '@app/dtos/auth.dto';
import { UserResponseDto, mapUser } from '@app/dtos/user.dto'
import { ACCESS_COOKIE } from '@app/constant';
import { ICryptoRepository } from '@app/interfaces/crypto.interface';
import { IUserTokenRepository } from '@app/interfaces/user-token.interface';
import { IUserRepository } from '@app/interfaces/user.interface';
import { ISystemConfigRepository } from '@app/interfaces/system-config.interface';

export interface LoginDetails {
  isSecure: boolean;
  clientIp: string;
  deviceType: string;
  deviceOS: string;
}

interface LoginResponse {
  response: LoginResponseDto;
  // cookie: string[];
}

interface OAuthProfile extends UserinfoResponse {
  email: string;
}

interface ClaimOptions<T> {
  key: string;
  default: T;
  isValid: (value: unknown) => boolean;
}

@Injectable()
export class AuthService {
  private configCore: SystemConfigCore;
  private logger = new Logger(AuthService.name);
  private userCore: UserCore;

  constructor(
    @Inject(ICryptoRepository) private cryptoRepository: ICryptoRepository,
    @Inject(ISystemConfigRepository) configRepository: ISystemConfigRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(IUserTokenRepository) private userTokenRepository: IUserTokenRepository,
  ) {
    this.configCore = SystemConfigCore.create(configRepository);
    this.userCore = UserCore.create(cryptoRepository, userRepository);

    custom.setHttpOptionsDefaults({ timeout: 30_000 });
  }

  async login(dto: LoginCredentialDto, details: LoginDetails): Promise<LoginResponse> {
    const config = await this.configCore.getConfig();
    if (!config.passwordLogin.enabled) {
      throw new UnauthorizedException('已关闭密码登录');
    }

    let user = await this.userRepository.getByEmail(dto.email, true);
    if (user) {
      const isAuthenticated = this.validatePassword(dto.password, user);
      if (!isAuthenticated) {
        user = null;
      }
    }

    if (!user) {
      this.logger.warn(`用户登录失败 ${dto.email} ip: ${details.clientIp}`);
      throw new UnauthorizedException('错误的电子邮件或密码');
    }

    return this.createLoginResponse(user, AuthType.PASSWORD, details);
  }

  async logout(auth: AuthDto, authType: AuthType): Promise<LogoutResponseDto> {
    if (auth.userToken) {
      await this.userTokenRepository.delete(auth.userToken.id);
    }

    return {
      successful: true,
      redirectUri: await this.getLogoutEndpoint(authType),
    };
  }

  async changePassword(auth: AuthDto, dto: ChangePasswordDto) {
    const { password, newPassword } = dto;
    const user = await this.userRepository.getByEmail(auth.user.email, true);
    if (!user) {
      throw new UnauthorizedException();
    }

    const valid = this.validatePassword(password, user);
    if (!valid) {
      throw new BadRequestException('密码错误');
    }

    return this.userCore.updateUser(auth.user.id, { password: newPassword });
  }

  async adminSignUp(dto: SignUpDto): Promise<UserResponseDto> {
    const adminUser = await this.userRepository.getAdmin();
    if (adminUser) {
      throw new BadRequestException('服务器已经有管理员了');
    }

    const admin = await this.userCore.createUser({
      isAdmin: true,
      email: dto.email,
      name: dto.name,
      password: dto.password,
      storageLabel: 'admin',
    });

    return mapUser(admin);
  }

  private async getLogoutEndpoint(authType: AuthType): Promise<string> {
    if (authType !== AuthType.OAUTH) {
      return LOGIN_URL;
    }

    const config = await this.configCore.getConfig();
    if (!config.oauth.enabled) {
      return LOGIN_URL;
    }

    const client = await this.getOAuthClient(config);
    return client.issuer.metadata.end_session_endpoint || LOGIN_URL;
  }

  private async createLoginResponse(user: UserEntity, authType: AuthType, loginDetails: LoginDetails) {
    const key = this.cryptoRepository.newPassword(32);
    const token = this.cryptoRepository.hashSha256(key);

    await this.userTokenRepository.create({
      token,
      user,
      deviceOS: loginDetails.deviceOS,
      deviceType: loginDetails.deviceType,
    });

    const response = mapLoginResponse(user, key);
    // const cookie = this.getCookies(response, authType, loginDetails);
    return { response };
  }

  private getBearerToken(headers: IncomingHttpHeaders): string | null {
    const [type, token] = (headers.authorization || '').split(' ');
    if (type.toLowerCase() === 'bearer') {
      return token;
    }

    return null;
  }

  private getCookieToken(headers: IncomingHttpHeaders): string | null {
    const cookies = cookieParser.parse(headers.cookie || '');
    return cookies[ACCESS_COOKIE] || null;
  }

  private async getOAuthProfile(config: SystemConfig, url: string): Promise<OAuthProfile> {
    const redirectUri = 'redirectUri'; // TODO
    const client = await this.getOAuthClient(config);
    const params = client.callbackParams(url);
    try {
      const tokens = await client.callback(redirectUri, params, { state: params.state });
      return client.userinfo<OAuthProfile>(tokens.access_token || '');
    } catch (error: Error | any) {
      if (error.message.includes('unexpected JWT alg received')) {
        this.logger.warn(
          [
            'Algorithm mismatch. Make sure the signing algorithm is set correctly in the OAuth settings.',
            'Or, that you have specified a signing key in your OAuth provider.',
          ].join(' '),
        );
      }

      throw error;
    }
  }

  private async getOAuthClient(config: SystemConfig) {
    const { enabled, clientId } = config.oauth;

    if (!enabled) {
      throw new BadRequestException('没有启用OAuth2');
    }

    const metadata: ClientMetadata = {
      client_id: clientId,
      response_types: ['code'],
    };

    try {
      const issuer = await Issuer.discover('');

      return new issuer.Client(metadata);
    } catch (error: any | AggregateError) {
      this.logger.error(`OAuth 错误: ${error}`, error?.stack, error?.errors);
      throw new InternalServerErrorException(`OAuth 错误: ${error}`, { cause: error });
    }
  }

  async authorize(dto: OAuthConfigDto): Promise<OAuthAuthorizeResponseDto> {
    const config = await this.configCore.getConfig();
    if (!config.oauth.enabled) {
      throw new BadRequestException('OAuth is not enabled');
    }

    const client = await this.getOAuthClient(config);
    const url = client.authorizationUrl({
      redirect_uri: dto.redirectUri,
      scope: 'config.oauth.scope',
      state: generators.state(),
    });

    return { url };
  }

  async link(auth: AuthDto, dto: OAuthCallbackDto): Promise<UserResponseDto> {
    const config = await this.configCore.getConfig();
    const { sub: oauthId } = await this.getOAuthProfile(config, dto.url);
    const duplicate = await this.userRepository.getByOAuthId(oauthId);
    if (duplicate && duplicate.id !== auth.user.id) {
      this.logger.warn(`OAuth link account failed: sub is already linked to another user (${duplicate.email}).`);
      throw new BadRequestException('This OAuth account has already been linked to another user.');
    }
    return mapUser(await this.userRepository.update(auth.user.id, { oauthId }));
  }

  async unlink(auth: AuthDto): Promise<UserResponseDto> {
    return mapUser(await this.userRepository.update(auth.user.id, { oauthId: '' }));
  }

  async callback(
    dto: OAuthCallbackDto,
    loginDetails: LoginDetails,
  ): Promise<{ response: LoginResponseDto }> {
    const config = await this.configCore.getConfig();
    const profile = await this.getOAuthProfile(config, dto.url);
    this.logger.debug(`Logging in with OAuth: ${JSON.stringify(profile)}`);
    let user = await this.userRepository.getByOAuthId(profile.sub);

    // link existing user
    if (!user) {
      const emailUser = await this.userRepository.getByEmail(profile.email);
      if (emailUser) {
        user = await this.userRepository.update(emailUser.id, { oauthId: profile.sub });
      }
    }

    // const { storageLabelClaim } = config.oauth;

    // register new user
    if (!user) {

      this.logger.log(`Registering new user: ${profile.email}/${profile.sub}`);
      this.logger.verbose(`OAuth Profile: ${JSON.stringify(profile)}`);

      const storageLabel = this.getClaim(profile, {
        key: 'storageLabelClaim',
        default: '',
        isValid: isString,
      });
      // const storageQuota = this.getClaim(profile, {
      //   key: storageQuotaClaim,
      //   default: defaultStorageQuota,
      //   isValid: (value: unknown) => isNumber(value) && value >= 0,
      // });

      const userName = profile.name ?? `${profile.given_name || ''} ${profile.family_name || ''}`;
      user = await this.userCore.createUser({
        name: userName,
        email: profile.email,
        oauthId: profile.sub,
        // quotaSizeInBytes: storageQuota * HumanReadableSize.GiB || null,
        storageLabel: storageLabel || null,
      });
    }

    return this.createLoginResponse(user, AuthType.OAUTH, loginDetails);
  }

  async validate(headers, params: Record<string, string>): Promise<AuthDto> {
    const userToken = (headers['user-token'] ||
      params.userToken ||
      this.getBearerToken(headers) ||
      this.getCookieToken(headers)) as string;

    if (userToken) {
      return this.validateUserToken(userToken);
    }

    throw new UnauthorizedException('需要身份验证');
  }

  private validatePassword(inputPassword: string, user: UserEntity): boolean {
    if (!user || !user.password) {
      return false;
    }
    return this.cryptoRepository.compareBcrypt(inputPassword, user.password);
  }

  private async validateUserToken(tokenValue: string): Promise<AuthDto> {
    const hashedToken = this.cryptoRepository.hashSha256(tokenValue);
    let userToken = await this.userTokenRepository.getByToken(hashedToken);

    if (userToken?.user) {
      const now = new Date();
      const diff = dayjs(now).diff(dayjs(userToken.updatedAt), 'hour');
      if (diff > 1) {
        userToken = await this.userTokenRepository.save({ ...userToken, updatedAt: new Date() });
      }
      return { user: userToken.user, userToken };
    }
    throw new UnauthorizedException('无效token');
  }

  private getClaim<T>(profile: OAuthProfile, options: ClaimOptions<T>): T {
    const value = profile[options.key as keyof OAuthProfile];
    return options.isValid(value) ? (value as T) : options.default;
  }
}
