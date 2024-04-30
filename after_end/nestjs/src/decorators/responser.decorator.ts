import { SetMetadata, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  HTTP_SUCCESS_MESSAGE,
  HTTP_RESPONSE_TRANSFORM,
  HTTP_RESPONSE_TRANSFORM_TO_PAGINATE
} from '@app/constant';

interface DecoratorCreatorOption {
  message?: string
  useTransform?: boolean
  usePaginate?: boolean
}

const reflector = new Reflector()

export const getResponseOptions = (target: any) => {
  return {
    message: reflector.get(HTTP_SUCCESS_MESSAGE, target),
    transform: reflector.get(HTTP_RESPONSE_TRANSFORM, target),
    paginate: reflector.get(HTTP_RESPONSE_TRANSFORM_TO_PAGINATE, target)
  }
}

const createDecorator = (options: DecoratorCreatorOption): MethodDecorator => {
  const { message, usePaginate, useTransform } = options
  return (_, __, descriptor: PropertyDescriptor) => {
    SetMetadata(HTTP_RESPONSE_TRANSFORM, useTransform)(descriptor.value);
    if (message) {
      SetMetadata(HTTP_SUCCESS_MESSAGE, message)(descriptor.value);
    }
    if (usePaginate) {
      SetMetadata(HTTP_RESPONSE_TRANSFORM_TO_PAGINATE, true)(descriptor.value);
    }
    return descriptor;
  }
}

export const handle = (message: string): MethodDecorator => {
  return createDecorator({ message })
}

export const paginate = (): MethodDecorator => {
  return createDecorator({ usePaginate: true })
}

export const transform = (useTransform?: boolean): MethodDecorator => {
  return createDecorator({ useTransform: useTransform })
}

export const Responser = { handle, paginate, transform }
