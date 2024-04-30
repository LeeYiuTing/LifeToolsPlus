import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Next,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import {
  CreateUserDto,
  CreateUserDto as CreateDto,
  DeleteUserDto, UpdateUserDto,
  UpdateUserDto as UpdateDto,
  UserResponseDto
} from '@app/dtos/user.dto';
import { UserService } from '@app/services/user.service'
import { UUIDParamDto } from '@app/validation';
import { AdminRoute, Auth } from '@app/middleware/auth.guard';
import { AuthDto } from '@app/dtos/auth.dto';
import { Authenticated } from '@app/middleware/auth.guard';

@ApiTags('User')
@Controller('user')
@Authenticated()
export class UserController {
  constructor(
    private service: UserService
  ) {}

  @ApiBody({ description: '获取所有用户' })
  @Get()
  getAllUsers(@Auth() auth: AuthDto, @Query('isAll') isAll: boolean): Promise<UserResponseDto[]> {
    return this.service.getAll(auth, isAll)
  }

  @Get('info/:id')
  getUserById(@Param() { id }: UUIDParamDto): Promise<UserResponseDto> {
    return this.service.get(id)
  }

  @Get('me')
  getMyUserInfo(@Auth() auth: AuthDto): Promise<UserResponseDto> {
    return this.service.getMe(auth)
  }

  @AdminRoute()
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.service.create(createUserDto)
  }

  @AdminRoute()
  @Delete(':id')
  deleteUser(
    @Auth() auth: AuthDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: DeleteUserDto,
  ): Promise<UserResponseDto> {
    return this.service.delete(auth, id, dto)
  }

  @AdminRoute()
  @Post(':id/restore')
  restoreUser(@Auth() auth: AuthDto, @Param() { id }: UUIDParamDto): Promise<UserResponseDto>{
    return this.service.restore(auth, id)
  }

  @Put(':id')
  updateUser(
    @Auth() auth: AuthDto,
    @Param() { id }: UUIDParamDto,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.service.update(auth, { id, ...updateUserDto})
  }

  // createProfileImage(): Promise<CreateProfileImageResponseDto>  {
  //
  // }
}
