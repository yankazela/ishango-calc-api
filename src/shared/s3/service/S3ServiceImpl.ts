import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FetchS3FileResponse, S3Service, UploadS3FileRequest, UploadS3FileResponse } from './S3Service';

@Injectable()
export class S3ServiceImpl implements S3Service {
	private readonly s3Client: S3Client;
	private readonly bucket?: string;

	constructor(private readonly configService: ConfigService) {
		const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
		const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

		this.bucket = this.configService.get<string>('AWS_S3_BUCKET');
		this.s3Client = new S3Client({
			region: this.configService.get<string>('AWS_REGION') ?? 'us-east-2',
			endpoint: this.configService.get<string>('AWS_S3_ENDPOINT') || undefined,
			forcePathStyle: this.configService.get<string>('AWS_S3_FORCE_PATH_STYLE') === 'true',
			credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
		});
	}

	async uploadFile(request: UploadS3FileRequest): Promise<UploadS3FileResponse> {
		const bucket = this.getBucketName();
		const key = this.buildObjectKey(request.file.originalname, request.folder);
		const contentType = request.file.mimetype || 'application/octet-stream';

		try {
			await this.s3Client.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: key,
					Body: request.file.buffer,
					ContentType: contentType,
					ContentLength: request.file.size,
					Metadata: {
						originalname: request.file.originalname,
					},
				}),
			);

			return {
				bucket,
				key,
				contentType,
				size: request.file.size,
			};
		} catch (error) {
			console.error('Error uploading file to S3:', error);
			throw new InternalServerErrorException('Unable to upload file to S3.');
		}
	}

	async fetchFile(key: string): Promise<FetchS3FileResponse> {
		const bucket = this.getBucketName();

		try {
			const response = await this.s3Client.send(
				new GetObjectCommand({
					Bucket: bucket,
					Key: key,
				}),
			);

			if (!response.Body) {
				throw new NotFoundException(`No file found for key: ${key}`);
			}

			return {
				body: Buffer.from(await response.Body.transformToByteArray()),
				contentType: response.ContentType,
				contentLength: response.ContentLength,
				fileName: response.Metadata?.originalname ?? this.getFileNameFromKey(key),
			};
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}

			if (error instanceof Error && ['NoSuchKey', 'NotFound'].includes(error.name)) {
				throw new NotFoundException(`No file found for key: ${key}`);
			}

			throw new InternalServerErrorException('Unable to fetch file from S3.');
		}
	}

	private getBucketName(): string {
		if (!this.bucket) {
			throw new InternalServerErrorException('AWS_S3_BUCKET is not configured.');
		}

		return this.bucket;
	}

	private buildObjectKey(originalName: string, folder?: string): string {
		const extension = extname(originalName);
		const baseName =
			basename(originalName, extension)
				.trim()
				.replace(/[^a-zA-Z0-9_-]+/g, '-')
				.replace(/^-+|-+$/g, '') || 'file';
		const normalizedFolder = folder
			?.trim()
			.replace(/^\/+|\/+$/g, '')
			.replace(/\.\./g, '');
		const fileName = `${baseName}-${randomUUID()}${extension}`;

		return normalizedFolder ? `${normalizedFolder}/${fileName}` : fileName;
	}

	private getFileNameFromKey(key: string): string {
		return key.split('/').at(-1) ?? key;
	}
}
