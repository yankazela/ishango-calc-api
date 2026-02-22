import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Subscriptions } from './Subscriptions';

@Entity()
export class Clients {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 100 })
	Firstname: string;

	@Column({ length: 100 })
	Lastname: string;

	@Column({ length: 100 })
	Email: string;

	@Column({ length: 12 })
	Phone: string;

	@Column({ length: 5 })
	CountryDialCode: string;

	@Column({ length: 100 })
	Company: string;

	@Column({ length: 50 })
	CompanySize: string;

	@Column({ default: true })
	IsSso: boolean;

	@Column({ length: 50 })
	SubscriptionId: string;

	@OneToOne(() => Subscriptions)
	@JoinColumn({ name: 'SubscriptionId', referencedColumnName: 'ID' })
	Subscription: Subscriptions;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
