import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Subscriptions } from './Subscriptions';
import { Plans } from './Plans';

@Entity()
export class SubscriptionCostHistory {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	SubscriptionID: string;

	@ManyToOne(() => Subscriptions)
	@JoinColumn({ name: 'SubscriptionID', referencedColumnName: 'ID' })
	Subscription: Subscriptions;

	@Column({ length: 50 })
	PlanID: string;

	@ManyToOne(() => Plans)
	@JoinColumn({ name: 'PlanID', referencedColumnName: 'ID' })
	Plan: Plans;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	Cost: number;

	@Column({ length: 20 })
	EffectiveDate: string;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
