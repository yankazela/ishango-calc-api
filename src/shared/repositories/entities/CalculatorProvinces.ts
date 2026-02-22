import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CalculatorTypes } from './CalculatorTypes';
import { Provinces } from './Provinces';

@Entity()
export class CalculatorProvinces {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	CalculatorTypeID: string;

	@Column({ length: 50 })
	ProvinceID: string;

	@Column({ type: 'longtext' })
	JsonSchema: string;

	@Column({ length: 5 })
	Year: string;

	@ManyToOne(() => Provinces)
	@JoinColumn({ name: 'ProvinceID', referencedColumnName: 'ID' })
	Province: Provinces;

	@ManyToOne(() => CalculatorTypes)
	@JoinColumn({ name: 'CalculatorTypeID', referencedColumnName: 'ID' })
	CalculatorType: CalculatorTypes;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
