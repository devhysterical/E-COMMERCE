import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { MessageLocalizationService } from '../i18n/message-localization.service';
import { getLanguageTag, resolveAppLanguage } from '../i18n/language';

@Catch()
@Injectable()
export class LocalizationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly localizationService: MessageLocalizationService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const language = resolveAppLanguage(request.headers['accept-language']);

    response.setHeader('Content-Language', getLanguageTag(language));
    response.setHeader('Vary', 'Accept-Language');

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const rawResponse = exception.getResponse();
      const payload =
        typeof rawResponse === 'string'
          ? {
              statusCode: status,
              message: rawResponse,
              error: exception.name.replace(/Exception$/, ''),
            }
          : Array.isArray(rawResponse)
            ? { statusCode: status, message: rawResponse }
            : { statusCode: status, ...(rawResponse as Record<string, unknown>) };

      response
        .status(status)
        .json(this.localizationService.localizeValue(payload, language));
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      this.localizationService.localizeValue(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          error: 'Internal Server Error',
        },
        language,
      ),
    );
  }
}
