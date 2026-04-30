import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseSymbols } from './ioc';
import * as Entities from '../repositories/entities';

@Module({
	providers: [
		{
			provide: DatabaseSymbols.DatabaseSource,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const dbType =
					(configService.get<string>('DB_TYPE') as 'mysql' | undefined) ??
					'mysql';
				const dbPort = Number(configService.get<string>('DB_PORT') ?? 3306);

				const dataSource = new DataSource({
					type: dbType,
					host: configService.get<string>('DB_HOST'),
					port: Number.isNaN(dbPort) ? 3306 : dbPort,
					username: configService.get<string>('DB_USERNAME'),
					password: configService.get<string>('DB_PASSWORD'),
					database: configService.get<string>('DB_NAME'),
					entities: Object.values(Entities),
					synchronize: true,
				});

				return dataSource.initialize();
			},
		},
	],

	exports: [DatabaseSymbols.DatabaseSource],
})
export class DatabaseModule {}
