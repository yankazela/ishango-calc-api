import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class FxRates {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 6 })
	BaseCurrency: string;

	@Column({ length: 6 })
	QuoteCurrency: string;

	@Column({ type: 'decimal', precision: 10, scale: 4 })
	Rate: number;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
