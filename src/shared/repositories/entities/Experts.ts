import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ExpertTypes } from './ExpertTypes';
import { ExpertStatuses } from './ExpertStatuses';

@Entity()
export class Experts {
	@PrimaryColumn({ length: 50 })
	ID: string;

	@Column({ length: 50 })
	Name: string;

	@Column({ length: 50 })
	Email: string;

	@Column({ length: 50 })
	Phone: string;

	@Column({ type: 'longtext' })
	Bio: string;

	@Column({ type: 'longtext' })
	ProfilePictureUrl: string;

	@Column({ length: 100 })
	Role: string;

	@Column()
	Rating: number;

	@Column({ length: 50 })
	ExpertTypeID: string;

	@Column({ length: 50 })
	ExpertStatusID: string;

	@ManyToOne(() => ExpertStatuses)
	@JoinColumn({ name: 'ExpertStatusID', referencedColumnName: 'ID' })
	ExpertStatus: ExpertStatuses;

	@ManyToOne(() => ExpertTypes)
	@JoinColumn({ name: 'ExpertTypeID', referencedColumnName: 'ID' })
	ExpertType: ExpertTypes;

	@Column()
	CreatedAt: string;

	@Column({ nullable: true })
	DisabledAt: string;
}
