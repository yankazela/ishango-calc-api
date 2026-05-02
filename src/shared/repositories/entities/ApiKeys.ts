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

	@Column({ length: 255 })
	ApiKey: string;

	@Column({ length: 128, nullable: true })
	ApiGatewayKeyId: string;

	@Column({ length: 255 })
	Name: string;

	@Column()
	IsActive: boolean;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
