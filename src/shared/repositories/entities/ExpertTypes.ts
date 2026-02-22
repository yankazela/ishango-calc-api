import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ExpertTypes {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 100 })
	Code: string;

	@Column({ length: 100 })
	Name: string;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
