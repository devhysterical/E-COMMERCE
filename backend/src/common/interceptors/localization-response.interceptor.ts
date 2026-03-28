import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getLanguageTag, resolveAppLanguage } from '../i18n/language';
import { MessageLocalizationService } from '../i18n/message-localization.service';

@Injectable()
export class LocalizationResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly localizationService: MessageLocalizationService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<{ headers: Record<string, string> }>();
    const response = httpContext.getResponse<Response>();
    const language = resolveAppLanguage(request.headers['accept-language']);

    response.setHeader('Content-Language', getLanguageTag(language));
    response.setHeader('Vary', 'Accept-Language');

    return next.handle().pipe(
      map((data) => {
        if (
          data == null ||
          data instanceof StreamableFile ||
          Buffer.isBuffer(data) ||
          data instanceof Uint8Array
        ) {
          return data;
        }

        return this.localizationService.localizeValue(data, language);
      }),
    );
  }
}
