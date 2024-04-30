import { ApiProperty } from '@nestjs/swagger';
import _ from 'lodash'

export class PaginationDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  list: T[];
}

export class ResponseDtoData<T> extends PaginationDto<T> {
  @ApiProperty({ type: () => Object })
  object: T;
}

export class ResponseDto<T = any> {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: () => Object })
  data: ResponseDtoData<T>;

  @ApiProperty()
  statusCode: number;

  constructor(
    res: any
  ) {
    this.message = res.message;
    this.data = res.data;
    this.statusCode = res.statusCode;
  }
}

