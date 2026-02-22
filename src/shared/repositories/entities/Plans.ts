import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Plans {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 100 })
	Description: string;

	@Column({ length: 20 })
	Code: string;

	@Column({ nullable: true })
	MaxApiCalculationsPerMonth: number;

	@Column({ nullable: true })
	MaxCountries: number;

	@Column({ nullable: true })
	MaxCalculators: number;

	@Column({ length: 30 })
	ApiType: string;

	@Column({ default: false })
	IsMostPopular: boolean;

	@Column({ default: false })
	IsCustomPrice: boolean;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
