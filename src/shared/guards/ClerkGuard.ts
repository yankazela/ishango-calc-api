import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyToken } from '@clerk/clerk-sdk-node';
import { Request } from 'express';

interface RequestWithUser extends Request {
	user?: { id: string };
}

@Injectable()
export class ClerkGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<RequestWithUser>();
		const authHeader = req.headers['authorization'];

		if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('No token');
		}

		const token = authHeader.replace('Bearer ', '');

		try {
			const secretKey = process.env.CLERK_SECRET_KEY;
			if (!secretKey) {
				throw new Error('CLERK_SECRET_KEY is not defined');
			}

			const session = await verifyToken(token, { secretKey });
			if (!session) throw new UnauthorizedException('Invalid token');
			req.user = { id: session.sub };
			return true;
		} catch (err: unknown) {
			throw new UnauthorizedException((err as Error).message);
		}
	}
}
