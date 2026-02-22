import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Plans } from './Plans';
import { Regions } from './Regions';

@Entity()
export class PlanPrices {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	PlanID: string;

	@ManyToOne(() => Plans)
	@JoinColumn({ name: 'PlanID', referencedColumnName: 'ID' })
	Plan: Plans;

	@Column({ length: 50 })
	RegionID: string;

	@ManyToOne(() => Regions)
	@JoinColumn({ name: 'RegionID', referencedColumnName: 'ID' })
	Region: Regions;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	Price: number;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
