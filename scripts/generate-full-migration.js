const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

const outputPath = path.resolve(__dirname, '../migrations/20260430_full_database_baseline.sql');
const migrationName = path.basename(outputPath, '.sql');

const connectionConfig = {
	host: process.env.DB_HOST || 'localhost',
	port: Number(process.env.DB_PORT || 8889),
	user: process.env.DB_USERNAME || process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || 'root',
	database: process.env.DB_NAME || 'Ishango_SAAS',
};

function replaceCreateTableStatement(createTableSql) {
	return createTableSql.replace(/^CREATE TABLE /i, 'CREATE TABLE IF NOT EXISTS ');
}

function buildInsertStatements(tableName, rows) {
	if (!rows.length) {
		return '';
	}

	const columns = Object.keys(rows[0]);
	const quotedColumns = columns.map((column) => `\`${column}\``).join(', ');
	const chunks = [];
	const batchSize = 100;

	for (let index = 0; index < rows.length; index += batchSize) {
		const batch = rows.slice(index, index + batchSize);
		const values = batch
			.map((row) => {
				const serializedValues = columns.map((column) => mysql.escape(row[column])).join(', ');
				return `(${serializedValues})`;
			})
			.join(',\n');

		chunks.push(`INSERT INTO \`${tableName}\` (${quotedColumns}) VALUES\n${values};`);
	}

	return `${chunks.join('\n\n')}\n`;
}

async function getTableNames(connection) {
	const [rows] = await connection.query('SHOW TABLES');
	const key = rows.length ? Object.keys(rows[0])[0] : null;
	return key ? rows.map((row) => row[key]) : [];
}

async function buildTableDump(connection, tableName) {
	const [createRows] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
	const createTableKey = Object.keys(createRows[0]).find((key) => key.toLowerCase().includes('create table'));
	const createTableSql = replaceCreateTableStatement(createRows[0][createTableKey]);
	const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);

	return [
		`-- =============================================`,
		`-- Table: ${tableName}`,
		`-- =============================================`,
		`${createTableSql};`,
		'',
		buildInsertStatements(tableName, rows),
	].join('\n');
}

function buildSchemaMigrationsTable() {
	return [
		'-- =============================================',
		'-- Table: schema_migrations',
		'-- =============================================',
		'CREATE TABLE IF NOT EXISTS `schema_migrations` (',
		'  `ID` varchar(50) NOT NULL,',
		'  `Name` varchar(255) NOT NULL,',
		'  `AppliedAt` varchar(255) NOT NULL,',
		'  `Notes` longtext DEFAULT NULL,',
		'  PRIMARY KEY (`ID`),',
		'  UNIQUE KEY `UQ_schema_migrations_Name` (`Name`)',
		') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;',
		'',
		`INSERT INTO \`schema_migrations\` (\`ID\`, \`Name\`, \`AppliedAt\`, \`Notes\`) VALUES`,
		`('58f3ad66-a975-4e7f-90b2-bb7a5b0aa8d1', '${migrationName}', '2026-04-30T00:00:00Z', 'Full baseline dump generated from the live Ishango_SAAS database plus migration bookkeeping.');`,
		'',
	].join('\n');
}

async function main() {
	const connection = await mysqlPromise.createConnection(connectionConfig);

	try {
		const tableNames = await getTableNames(connection);
		const chunks = [
			'-- Full database baseline generated from the live database.',
			'-- Intended for initializing an empty database, not for incremental replay on a populated one.',
			'',
			'SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";',
			'START TRANSACTION;',
			'SET time_zone = "+00:00";',
			'SET FOREIGN_KEY_CHECKS = 0;',
			'',
			'/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;',
			'/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;',
			'/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;',
			'/*!40101 SET NAMES utf8mb4 */;',
			'',
		];

		for (const tableName of tableNames) {
			chunks.push(await buildTableDump(connection, tableName));
		}

		if (!tableNames.includes('schema_migrations')) {
			chunks.push(buildSchemaMigrationsTable());
		}

		chunks.push(
			'SET FOREIGN_KEY_CHECKS = 1;',
			'COMMIT;',
			'',
			'/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;',
			'/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;',
			'/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;',
			''
		);

		fs.mkdirSync(path.dirname(outputPath), { recursive: true });
		fs.writeFileSync(outputPath, chunks.join('\n'), 'utf8');
		console.log(`Wrote full migration to ${outputPath}`);
	} finally {
		await connection.end();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});