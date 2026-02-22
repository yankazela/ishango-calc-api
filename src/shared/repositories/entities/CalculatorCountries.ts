import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Countries } from './Countries';
import { CalculatorTypes } from './CalculatorTypes';

@Entity()
export class CalculatorCountries {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	CalculatorTypeID: string;

	@Column({ length: 50 })
	CountryID: string;

	@Column({ type: 'longtext' })
	JsonSchema: string;

	@Column()
	WithProvincial: boolean;

	@Column({ length: 5 })
	Year: string;

	@ManyToOne(() => Countries)
	@JoinColumn({ name: 'CountryID', referencedColumnName: 'ID' })
	Country: Countries;

	@ManyToOne(() => CalculatorTypes)
	@JoinColumn({ name: 'CalculatorTypeID', referencedColumnName: 'ID' })
	CalculatorType: CalculatorTypes;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
