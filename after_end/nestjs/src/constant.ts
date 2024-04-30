export const envName = (process.env.NODE_ENV || 'development').toUpperCase();

export const isDev = process.env.NODE_ENV === 'development';

export const excludePaths = ['/.well-known/immich', '/custom.css', '/favicon.ico'];

export const APP_MEDIA_LOCATION = process.env.MEDIA_LOCATION || './upload';

export enum QueueName {
  THUMBNAIL_GENERATION = 'thumbnailGeneration',
  METADATA_EXTRACTION = 'metadataExtraction',
  VIDEO_CONVERSION = 'videoConversion',
  FACE_DETECTION = 'faceDetection',
  FACIAL_RECOGNITION = 'facialRecognition',
  SMART_SEARCH = 'smartSearch',
  BACKGROUND_TASK = 'backgroundTask',
  STORAGE_TEMPLATE_MIGRATION = 'storageTemplateMigration',
  MIGRATION = 'migration',
  SEARCH = 'search',
  SIDECAR = 'sidecar',
  LIBRARY = 'library',
}

export const ACCESS_COOKIE = 'access_token';

export const LOGIN_URL = ''

export enum AuthType {
  PASSWORD = 'password',
  OAUTH = 'oauth',
}

// response 反射key
export const HTTP_RESPONSE_TRANSFORM = '__appHttpResponseTransform__';
export const HTTP_RESPONSE_TRANSFORM_TO_PAGINATE = '__appHttpResponseTransformToPaginate__';
export const HTTP_SUCCESS_MESSAGE = '__appHttpSuccessMessage__';
export const HTTP_ERROR_MESSAGE = '__appHttpErrorMessage__';
