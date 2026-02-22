import { Module } from '@nestjs/common';
import { PingServiceImpl } from './service/PingServiceImpl';
import { PingSymbols } from './ioc';
import { PingController } from './PingController';

@Module({
	imports: [],
	controllers: [PingController],
	providers: [
		{
			provide: PingSymbols.PingService,
			useClass: PingServiceImpl,
		},
	],
})
export class PingModule {}
