import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Experts } from './Experts';
import { CalculatorCountries } from './CalculatorCountries';

@Entity()
export class ExpertiseCountries {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	ExpertID: string;

	@Column({ length: 50 })
	CalculatorCountryID: string;

	@ManyToOne(() => Experts)
	@JoinColumn({ name: 'ExpertID', referencedColumnName: 'ID' })
	Expert: Experts;

	@ManyToOne(() => CalculatorCountries)
	@JoinColumn({ name: 'CalculatorCountryID', referencedColumnName: 'ID' })
	CalculatorCountry: CalculatorCountries;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
