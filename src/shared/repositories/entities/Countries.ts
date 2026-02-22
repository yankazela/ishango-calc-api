import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Countries {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 100 })
	Name: string;

	@Column({ length: 10 })
	Code: string;

	@Column({ length: 5 })
	Currency: string;

	@Column({ length: 5 })
	CurrencySymbol: string;

	@Column({ length: 200, nullable: true })
	FlagUrl: string;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
