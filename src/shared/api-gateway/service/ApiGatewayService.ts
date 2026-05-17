export type CreateApiGatewayApiKeyRequest = {
	name: string;
	description?: string;
	enabled?: boolean;
	value?: string;
	customerId?: string;
	generateDistinctId?: boolean;
	usagePlanId?: string;
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

export type ApiKeyUsage = {
	used: number;
	remaining: number | null;
};

export interface ApiGatewayService {
	createApiKey(request: CreateApiGatewayApiKeyRequest): Promise<ApiGatewayApiKeyResponse>;
	activateApiKey(apiKeyId: string): Promise<void>;
	deactivateApiKey(apiKeyId: string): Promise<void>;
	deleteApiKey(apiKeyId: string): Promise<void>;
	getApiKeysUsage(usagePlanId: string, startDate: string, endDate: string): Promise<Record<string, ApiKeyUsage>>;
}