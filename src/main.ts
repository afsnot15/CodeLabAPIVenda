import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { rmqConfig } from './config/queue/rmq.config';
import { ResponseExceptionsFilter } from './shared/filters/response-exception.filter';
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1/venda');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new ResponseExceptionsFilter());

  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>(
    rmqConfig(app.get(ConfigService), 'venda.create-venda'),
  );
  await app.startAllMicroservices();

  setupOpenApi(app);

  await app.listen(3006);

  Logger.log(
    `Application is running on: ${await app.getUrl()}`,
    'CodeLabAPIVenda',
  );
}

bootstrap();

function setupOpenApi(app: INestApplication): void {
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder().setTitle('CodeLabAPIVenda').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });

    Logger.log(`Swagger UI is running on path /docs`, 'CodeLabAPIVenda');
  }
}
