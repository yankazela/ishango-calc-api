import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { DatabaseSymbols } from './ioc';
import * as Entities from '../repositories/entities';

@Module({
	providers: [
		{
			provide: DatabaseSymbols.DatabaseSource,
			useFactory: async () => {
				const dataSource = new DataSource({
					type: 'mysql',
					host: 'localhost',
					port: 8889,
					username: 'root',
					password: 'root',
					database: 'Ishango_SAAS',
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
