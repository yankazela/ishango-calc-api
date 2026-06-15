import { Module } from '@nestjs/common';
import { SESSymbols } from './ioc';
import { SESServiceImpl } from './service/SESServiceImpl';
import { S3Module } from '../s3/S3Module';

@Module({
	imports: [S3Module],
	providers: [
		{
			provide: SESSymbols.SESService,
			useClass: SESServiceImpl,
		},
	],
	exports: [SESSymbols.SESService],
})
export class SESModule {}
