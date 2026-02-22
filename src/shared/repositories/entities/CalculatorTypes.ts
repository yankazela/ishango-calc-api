import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CalculatorTypes {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 100 })
	Name: string;

	@Column({ length: 100 })
	Description: string;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
