import { Controller, Get, Inject } from '@nestjs/common';
import type { PingService } from './service/PingService';
import { PingSymbols } from './ioc';

@Controller()
export class PingController {
	constructor(
		@Inject(PingSymbols.PingService)
		private readonly pingService: PingService,
	) {}

	@Get('ping')
	ping(): string {
		return this.pingService.ping();
	}
}
