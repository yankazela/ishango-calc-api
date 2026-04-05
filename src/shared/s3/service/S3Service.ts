export type S3UploadFile = {
	buffer: Buffer;
	originalname: string;
	mimetype: string;
	size: number;
};

export type UploadS3FileRequest = {
	file: S3UploadFile;
	folder?: string;
};

export type UploadS3FileResponse = {
	bucket: string;
	key: string;
	contentType: string;
	size: number;
};

export type FetchS3FileResponse = {
	body: Buffer;
	contentType?: string;
	contentLength?: number;
	fileName: string;
};

export interface S3Service {
	uploadFile(request: UploadS3FileRequest): Promise<UploadS3FileResponse>;
	fetchFile(key: string): Promise<FetchS3FileResponse>;
}
