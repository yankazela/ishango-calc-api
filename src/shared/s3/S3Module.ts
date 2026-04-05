import { Module } from '@nestjs/common';
import { S3Symbols } from './ioc';
import { S3ServiceImpl } from './service/S3ServiceImpl';

@Module({
	providers: [
		{
			provide: S3Symbols.S3Service,
			useClass: S3ServiceImpl,
		},
	],
	exports: [S3Symbols.S3Service],
})
export class S3Module {}
