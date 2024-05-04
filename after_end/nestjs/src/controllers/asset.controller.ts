import { FileUploadInterceptor, mapToUploadFile } from '@app/middleware/file-upload.interceptor';
import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  ParseFilePipe,
  Body,
  UseInterceptors,
  HttpStatus,
  Res, Query
} from '@nestjs/common';
import { Auth, Authenticated } from '@app/middleware/auth.guard';
import { AuthDto } from '@app/dtos/auth.dto';
import { FileNotEmptyValidator } from '@app/validation';
import { CreateAssetDto } from '@app/dtos/asset.dto';
import { AssetResponseDto, AssetSearchDto, Route, UploadFiles } from '@app/interfaces/asset.interface';
import { Response } from 'express';
import { AssetService } from '@app/services/asset.service';

@Controller(Route.ASSET)
@Authenticated()
export class AssetController {
  constructor(
    private service: AssetService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileUploadInterceptor)
  async uploadFile(
    @Auth() auth: AuthDto,
    @UploadedFiles(new ParseFilePipe({ validators: [new FileNotEmptyValidator(['assetData'])] })) files: UploadFiles,
    @Body() dto: CreateAssetDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = mapToUploadFile(files.assetData[0]);

    const responseDto = await this.service.uploadFile(auth, dto, file);
    if (responseDto.duplicate) {
      res.status(HttpStatus.OK);
    }

    return responseDto;
  }

  @Get('/')
  getAllAssets(
    @Auth() auth: AuthDto,
    @Query() dto: AssetSearchDto
  ): Promise<AssetResponseDto[]> {
    return this.service.getAllAssets(auth, dto);
  }
}
