import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { serverVersion } from '@app/utils/version';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { Metadata } from '@app/middleware/auth.guard';
import { orderBy } from 'lodash';

function sortKeys<T>(target: T): T {
  if (!target || typeof target !== 'object' || Array.isArray(target)) {
    return target;
  }

  const result: Partial<T> = {};
  const keys = Object.keys(target).sort() as Array<keyof T>;
  for (const key of keys) {
    result[key] = sortKeys(target[key]);
  }
  return result as T;
}

export const isConnectionAborted = (error: Error | any) => error.code === 'ECONNABORTED';

export const routeToErrorMessage = (methodName: string) =>
  'Failed to ' + methodName.replaceAll(/[A-Z]+/g, (letter) => ` ${letter.toLowerCase()}`);

const patchOpenAPI = (document: OpenAPIObject) => {
  document.paths = sortKeys(document.paths);

  if (document.components?.schemas) {
    const schemas = document.components.schemas as Record<string, SchemaObject>;

    document.components.schemas = sortKeys(schemas);

    for (const schema of Object.values(schemas)) {
      if (schema.properties) {
        schema.properties = sortKeys(schema.properties);
      }

      if (schema.required) {
        schema.required = schema.required.sort();
      }
    }
  }

  for (const [key, value] of Object.entries(document.paths)) {
    const newKey = key.replace('/api/', '/');
    delete document.paths[key];
    document.paths[newKey] = value;
  }

  for (const path of Object.values(document.paths)) {
    const operations = {
      get: path.get,
      put: path.put,
      post: path.post,
      delete: path.delete,
      options: path.options,
      head: path.head,
      patch: path.patch,
      trace: path.trace,
    };

    for (const operation of Object.values(operations)) {
      if (!operation) {
        continue;
      }

      if ((operation.security || []).some((item) => !!item[Metadata.PUBLIC_SECURITY])) {
        delete operation.security;
      }

      if (operation.summary === '') {
        delete operation.summary;
      }

      if (operation.operationId) {
        // console.log(`${routeToErrorMessage(operation.operationId).padEnd(40)} (${operation.operationId})`);
      }

      if (operation.description === '') {
        delete operation.description;
      }

      if (operation.parameters) {
        operation.parameters = orderBy(operation.parameters, 'name');
      }
    }
  }

  return document;
};

export const useSwagger = (app: INestApplication, isDevelopment: boolean) => {
  const config = new DocumentBuilder()
    .setTitle('nest')
    .setDescription('Nest API')
    .setVersion(serverVersion.toString())
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      in: 'header',
    })
    .addServer('/api')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  };

  const specification = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Documentation',
  };

  SwaggerModule.setup('doc', app, specification, customOptions);

  if (isDevelopment) {
    // Generate API Documentation only in development mode
    const outputPath = resolve(process.cwd(), '../open-api/openapi-specs.json');
    writeFileSync(outputPath, JSON.stringify(patchOpenAPI(specification), null, 2), { encoding: 'utf8' });
  }
}
