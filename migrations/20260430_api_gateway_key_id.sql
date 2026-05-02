-- Adds the external AWS API Gateway key id to locally stored subscription API keys.

START TRANSACTION;

SET @column_exists := (
	SELECT COUNT(*)
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
		AND TABLE_NAME = 'api_keys'
		AND COLUMN_NAME = 'ApiGatewayKeyId'
);

SET @alter_sql := IF(
	@column_exists = 0,
	'ALTER TABLE `api_keys` ADD COLUMN `ApiGatewayKeyId` varchar(128) DEFAULT NULL AFTER `ApiKey`',
	'SELECT 1'
);

PREPARE alter_statement FROM @alter_sql;
EXECUTE alter_statement;
DEALLOCATE PREPARE alter_statement;

SET @has_schema_migrations := (
	SELECT COUNT(*)
	FROM INFORMATION_SCHEMA.TABLES
	WHERE TABLE_SCHEMA = DATABASE()
		AND TABLE_NAME = 'schema_migrations'
);

SET @migration_applied := IF(
	@has_schema_migrations = 1,
	(
		SELECT COUNT(*)
		FROM `schema_migrations`
		WHERE `Name` = '20260430_api_gateway_key_id.sql'
	),
	0
);

SET @insert_sql := IF(
	@has_schema_migrations = 1 AND @migration_applied = 0,
	"INSERT INTO `schema_migrations` (`ID`, `Name`, `AppliedAt`, `Notes`) VALUES ('20260430_api_gateway_key_id', '20260430_api_gateway_key_id.sql', NOW(), 'Adds ApiGatewayKeyId to api_keys for AWS API Gateway synchronization.')",
	'SELECT 1'
);

PREPARE insert_statement FROM @insert_sql;
EXECUTE insert_statement;
DEALLOCATE PREPARE insert_statement;

COMMIT;