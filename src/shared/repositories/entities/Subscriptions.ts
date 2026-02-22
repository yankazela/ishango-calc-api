import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Plans } from './Plans';
import { SubscriptionStatuses } from './SubscriptionStatuses';
import { PaymentFrequencies } from './PaymentFrequencies';

@Entity()
export class Subscriptions {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	PlanId: string;

	@ManyToOne(() => Plans)
	@JoinColumn({ name: 'PlanId', referencedColumnName: 'ID' })
	Plan: Plans;

	@Column({ length: 20 })
	StartDate: string;

	@Column({ length: 50 })
	PaymentFrequencyId: string;

	@ManyToOne(() => PaymentFrequencies)
	@JoinColumn({ name: 'PaymentFrequencyId', referencedColumnName: 'ID' })
	PaymentFrequency: PaymentFrequencies;

	@Column({ length: 50 })
	StatusId: string;

	@ManyToOne(() => SubscriptionStatuses)
	@JoinColumn({ name: 'StatusId', referencedColumnName: 'ID' })
	Status: SubscriptionStatuses;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	CurrentCost: number;

	@Column({ length: 6 })
	CurrencyRegionCode: string;

	@Column({ type: 'longtext' })
	SelectedCalculators: string;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
