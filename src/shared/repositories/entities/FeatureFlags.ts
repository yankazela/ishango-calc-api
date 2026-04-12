import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('feature_flags')
export class FeatureFlags {
	@PrimaryColumn({ name: 'id', length: 50 })
	ID: string;
	@Column({ name: 'name', length: 30 })
	Name: string;
	@Column({ name: 'description', length: 255 })
	Description: string;
	@Column({ name: 'is_enabled' })
	IsEnabled: boolean;
	@Column({ name: 'created_at' })
	CreatedAt: string;
	@Column({ name: 'disabled_at' })
	DisabledAt: string;
}
