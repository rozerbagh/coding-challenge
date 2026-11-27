import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { validateEnvironment } from './common/environment-config';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { HealthModule } from './modules/health/health.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(process.cwd(), '../../.env'),
      ],
      validate: (config) => validateEnvironment(config as NodeJS.ProcessEnv),
    }),
    HealthModule,
    ProductsModule,
    EnquiriesModule,
  ],
})
export class AppModule {}
