import { Module } from '@nestjs/common';
import { CountryRepositoryModule } from '../../shared/repositories/country/CountryRepositoryModule';
import { S3Module } from '../../shared/s3/S3Module';
import { CountryController } from './CountryController';
import { CountrySymbols } from './ioc';
import { CountryServiceImpl } from './service/CountryServiceImpl';

@Module({
	imports: [CountryRepositoryModule, S3Module],
	controllers: [CountryController],
	providers: [
		{
			provide: CountrySymbols.CountryService,
			useClass: CountryServiceImpl,
		},
	],
})
export class CountryModule {}
