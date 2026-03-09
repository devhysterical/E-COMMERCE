import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 4000;

  // --- Database ---
  @IsString()
  @IsNotEmpty({ message: 'DATABASE_URL is required' })
  DATABASE_URL!: string;

  // --- Auth ---
  @IsString()
  @IsNotEmpty({ message: 'JWT_SECRET is required' })
  JWT_SECRET!: string;

  // --- Supabase ---
  @IsString()
  @IsNotEmpty({ message: 'SUPABASE_URL is required' })
  SUPABASE_URL!: string;

  @IsString()
  @IsNotEmpty({ message: 'SUPABASE_SERVICE_KEY is required' })
  SUPABASE_SERVICE_KEY!: string;

  // --- SMTP ---
  @IsString()
  @IsNotEmpty({ message: 'SMTP_USER is required' })
  SMTP_USER!: string;

  @IsString()
  @IsNotEmpty({ message: 'SMTP_PASS is required' })
  SMTP_PASS!: string;

  @IsString()
  @IsOptional()
  SMTP_HOST: string = 'smtp.gmail.com';

  @IsNumber()
  @IsOptional()
  SMTP_PORT: number = 587;

  @IsString()
  @IsOptional()
  ADMIN_EMAIL?: string;

  // --- Frontend / Backend URLs ---
  @IsString()
  @IsOptional()
  FRONTEND_URL: string = 'http://localhost:5173';

  @IsString()
  @IsOptional()
  BACKEND_URL: string = 'http://localhost:4000';

  // --- MoMo Payment ---
  @IsString()
  @IsOptional()
  MOMO_PARTNER_CODE?: string;

  @IsString()
  @IsOptional()
  MOMO_ACCESS_KEY?: string;

  @IsString()
  @IsOptional()
  MOMO_SECRET_KEY?: string;

  @IsString()
  @IsOptional()
  MOMO_API_ENDPOINT: string = 'https://test-payment.momo.vn';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((err) => {
        const constraints = err.constraints
          ? Object.values(err.constraints).join(', ')
          : 'unknown error';
        return `  - ${err.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(
      `\n❌ Environment validation failed:\n${messages}\n\nPlease check your .env file.\n`,
    );
  }

  return validatedConfig;
}
