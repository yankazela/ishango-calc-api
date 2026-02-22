import { Module } from '@nestjs/common';
import { PingModule } from './api/ping/PingModule';
import { CalculatorModule } from './api/calculator/CalculatorModule';
import { CountryModule } from './api/country/CountryModule';
import { ExpertModule } from './api/expert/ExpertModule';
import { PlanModule } from './api/plan/PlanModule';
import { SubscriptionModule } from './api/subscription/SubscriptionModule';

@Module({
	imports: [CalculatorModule, CountryModule, ExpertModule, PingModule, PlanModule, SubscriptionModule],
	controllers: [],
})
export class AppModule {}
