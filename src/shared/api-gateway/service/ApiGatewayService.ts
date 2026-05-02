export type CreateApiGatewayApiKeyRequest = {
	name: string;
	description?: string;
	enabled?: boolean;
	value?: string;
	customerId?: string;
	generateDistinctId?: boolean;
	stageKeys?: Array<{
		restApiId: string;
		stageName: string;
	}>;
	tags?: Record<string, string>;
};

export type ApiGatewayApiKeyResponse = {
	id: string;
	name: string;
	value?: string;
	enabled: boolean;
	description?: string;
};

export interface ApiGatewayService {
	createApiKey(request: CreateApiGatewayApiKeyRequest): Promise<ApiGatewayApiKeyResponse>;
	activateApiKey(apiKeyId: string): Promise<void>;
	deactivateApiKey(apiKeyId: string): Promise<void>;
	deleteApiKey(apiKeyId: string): Promise<void>;
}