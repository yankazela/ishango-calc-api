import { Module } from '@nestjs/common';
import { ApiGatewaySymbols } from './ioc';
import { ApiGatewayServiceImpl } from './service/ApiGatewayServiceImpl';

@Module({
	providers: [
		{
			provide: ApiGatewaySymbols.ApiGatewayService,
			useClass: ApiGatewayServiceImpl,
		},
	],
	exports: [ApiGatewaySymbols.ApiGatewayService],
})
export class ApiGatewayModule {}