import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Countries } from './Countries';

@Entity()
export class Provinces {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 100 })
	Name: string;

	@Column({ length: 10 })
	Code: string;

	@Column({ length: 50 })
	CountryID: string;

	@ManyToOne(() => Countries)
	@JoinColumn({ name: 'CountryID', referencedColumnName: 'ID' })
	Country: Countries;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
