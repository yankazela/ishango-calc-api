import { PingService } from './PingService';

export class PingServiceImpl implements PingService {
	ping(): string {
		return 'pong';
	}
}
