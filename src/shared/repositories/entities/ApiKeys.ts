import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Subscriptions } from './Subscriptions';

@Entity('api_keys')
export class ApiKeys {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	SubscriptionID: string;

	@ManyToOne(() => Subscriptions)
	@JoinColumn({ name: 'SubscriptionID', referencedColumnName: 'ID' })
	Subscription: Subscriptions;

	@Column({ length: 100 })
	ApiKey: string;

	@Column({ length: 128 })
	ApiGatewayKeyId: string;

	@Column({ length: 100 })
	Name: string;

	@Column()
	IsActive: boolean;

	@Column({ length: 30 })
	CreatedAt: string;

	@Column({ length: 30, nullable: true })
	DisabledAt: string;
}
