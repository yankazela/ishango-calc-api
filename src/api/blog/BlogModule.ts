import { Module } from '@nestjs/common';
import { S3Module } from '../../shared/s3/S3Module';
import { BlogController } from './BlogController';
import { BlogSymbols } from './ioc';
import { BlogServiceImpl } from './service/BlogServiceImpl';

@Module({
	imports: [S3Module],
	controllers: [BlogController],
	providers: [
		{
			provide: BlogSymbols.BlogService,
			useClass: BlogServiceImpl,
		},
	],
})
export class BlogModule {}
