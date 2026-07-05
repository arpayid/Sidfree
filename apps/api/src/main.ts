import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { SanitizeInterceptor } from './common/sanitize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new SanitizeInterceptor());
  
  const config = new DocumentBuilder()
    .setTitle('SIDPRO API')
    .setDescription('Sistem Informasi Desa - API Documentation')
    .setVersion('1.0.0')
    .addTag('public', 'Public endpoints (complaints, letters)')
    .addTag('admin', 'Admin endpoints (requires auth)')
    .addTag('health', 'Health check endpoints')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  
  const PORT = process.env.PORT || 3003;
  await app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/docs`);
  }); 
}
bootstrap();
