import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Regions {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 100 })
	Name: string;

	@Column({ length: 50 })
	Code: string;

	@Column({ length: 3 })
	Currency: string;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
