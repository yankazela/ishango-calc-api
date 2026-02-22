import { Module } from '@nestjs/common';
import { CountryRepositoryModule } from '../../shared/repositories/country/CountryRepositoryModule';
import { CountryController } from './CountryController';
import { CountrySymbols } from './ioc';
import { CountryServiceImpl } from './service/CountryServiceImpl';

@Module({
	imports: [CountryRepositoryModule],
	controllers: [CountryController],
	providers: [
		{
			provide: CountrySymbols.CountryService,
			useClass: CountryServiceImpl,
		},
	],
})
export class CountryModule {}
