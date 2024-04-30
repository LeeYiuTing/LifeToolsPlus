import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { Logger } from '@app/utils/logger';
import { isConnectionAborted, routeToErrorMessage } from '@app/utils/misc';
import { map } from 'rxjs/operators';
import { getResponseOptions } from '@app/decorators/responser.decorator';
import { ResponseDto } from '@app/dtos/response.dto';

@Injectable()
export class ErrorInterceptor<T> implements NestInterceptor {
  private logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseDto<T>> {
    const { statusCode } = context.switchToHttp().getResponse();
    const target = context.getHandler()
    const { message, paginate, transform } = getResponseOptions(target)
    return next.handle().pipe(
      // success
      map((data: any) => {
        if (transform === false) {
          return data
        }
        if (paginate) {
          return {
            statusCode,
            data: {
              page: data.offset,
              pageSize: data.limit,
              total: data.total,
              list: data.list
            },
            message: message ?? 'success'
          }
        }
        return {
          statusCode,
          data,
          message: message ?? 'success'
        }
      }),
      // error
      catchError((error) =>
        throwError(() => {
          if (!(error instanceof HttpException)) {
            const errorMessage = routeToErrorMessage(context.getHandler().name);
            if (!isConnectionAborted(error)) {
              this.logger.error(errorMessage, error, error?.errors, error?.stack);
            }
            return new InternalServerErrorException(errorMessage);
          } else {
            return error;
          }
        }),
      ),
    );
  }
}
