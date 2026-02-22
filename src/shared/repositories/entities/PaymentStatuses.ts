import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class PaymentStatuses {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 100 })
	Description: string;

	@Column({ length: 20 })
	Code: string;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
