import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PingModule } from './api/ping/PingModule';
import { CalculatorModule } from './api/calculator/CalculatorModule';
import { CountryModule } from './api/country/CountryModule';
import { ExpertModule } from './api/expert/ExpertModule';
import { PlanModule } from './api/plan/PlanModule';
import { SubscriptionModule } from './api/subscription/SubscriptionModule';
import { FeatureFlagModule } from './api/feature-flag/FeatureFlagModule';
import { BlogModule } from './api/blog/BlogModule';
import { S3Module } from './shared/s3/S3Module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		BlogModule,
		CalculatorModule,
		CountryModule,
		ExpertModule,
		FeatureFlagModule,
		PingModule,
		PlanModule,
		SubscriptionModule,
		S3Module,
	],
	controllers: [],
})
export class AppModule {}
