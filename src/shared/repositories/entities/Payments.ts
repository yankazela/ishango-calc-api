import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Subscriptions } from './Subscriptions';
import { PaymentStatuses } from './PaymentStatuses';

@Entity()
export class Payments {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	SubscriptionID: string;

	@ManyToOne(() => Subscriptions)
	@JoinColumn({ name: 'SubscriptionID', referencedColumnName: 'ID' })
	Subscription: Subscriptions;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	Amount: number;

	@Column({ length: 20 })
	PaymentDate: string;

	@Column({ length: 50 })
	TransactionReference: string;

	@Column({ length: 50 })
	PaymentMethod: string;

	@Column({ length: 50 })
	StatusId: string;

	@ManyToOne(() => PaymentStatuses)
	@JoinColumn({ name: 'StatusId', referencedColumnName: 'ID' })
	Status: PaymentStatuses;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
