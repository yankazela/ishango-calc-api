SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

DROP PROCEDURE IF EXISTS `AddIndexIfNotExists`;
DELIMITER //
CREATE PROCEDURE `AddIndexIfNotExists`(IN p_table VARCHAR(64), IN p_index VARCHAR(64), IN p_sql TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = p_table AND INDEX_NAME = p_index LIMIT 1
  ) THEN
    SET @ddl = p_sql;
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

-- Migration bookkeeping for raw SQL deployments.
CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `AppliedAt` varchar(255) NOT NULL,
  `Notes` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CALL AddIndexIfNotExists('schema_migrations', 'PRIMARY', 'ALTER TABLE `schema_migrations` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('schema_migrations', 'UQ_schema_migrations_Name', 'ALTER TABLE `schema_migrations` ADD UNIQUE KEY `UQ_schema_migrations_Name` (`Name`)');
CALL AddIndexIfNotExists('calculator_types', 'UQ_calculator_types_Name', 'ALTER TABLE `calculator_types` ADD UNIQUE KEY `UQ_calculator_types_Name` (`Name`)');
CALL AddIndexIfNotExists('countries', 'UQ_countries_Code', 'ALTER TABLE `countries` ADD UNIQUE KEY `UQ_countries_Code` (`Code`)');
CALL AddIndexIfNotExists('calculator_countries', 'IDX_calculator_countries_lookup', 'ALTER TABLE `calculator_countries` ADD KEY `IDX_calculator_countries_lookup` (`CountryID`, `CalculatorTypeID`, `Year`, `DisabledAt`)');

-- Seed calculator types so the DDL-only schema can serve the calculator APIs.
INSERT INTO `calculator_types` (`ID`, `Name`, `Description`, `CreatedAt`, `DisabledAt`)
SELECT * FROM (
  SELECT '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d' AS `ID`, 'INHERITANCE_TAX' AS `Name`, 'Inheritance Tax Calculator' AS `Description`, '2026-04-30T00:00:00Z' AS `CreatedAt`, NULL AS `DisabledAt`
  UNION ALL
  SELECT '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', 'INCOME_TAX', 'Income Tax Calculator', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', 'MORTGAGE', 'Mortgage Calculator', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT 'de10134b-ffab-4835-b608-592934b4331e', 'CAPITAL_GAINS', 'Capital gain tax', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', 'CORPORATE_TAX', 'Corporate Tax', '2026-04-30T00:00:00Z', NULL
) AS seed
WHERE NOT EXISTS (
  SELECT 1 FROM `calculator_types` existing WHERE existing.`ID` = seed.`ID` OR existing.`Name` = seed.`Name`
);

-- Seed the current country catalog expected by the calculator services.
INSERT INTO `countries` (`ID`, `Name`, `Code`, `FlagUrl`, `Currency`, `CurrencySymbol`, `CreatedAt`, `DisabledAt`)
SELECT * FROM (
  SELECT '0328a50e-d83b-45a6-a963-d19983e83763' AS `ID`, 'BRAZIL' AS `Name`, 'BR' AS `Code`, 'www.brazil.gov.br' AS `FlagUrl`, 'BRL' AS `Currency`, 'R$' AS `CurrencySymbol`, '2026-04-30T00:00:00Z' AS `CreatedAt`, NULL AS `DisabledAt`
  UNION ALL
  SELECT '08891a23-c70c-4fc3-a7d4-47ec69d3ea13', 'INDIA', 'IN', 'www.india.gov.in', 'INR', '₹', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT '103e8f49-f86a-4312-8cb9-511f872e5d84', 'UNITED_KINGDOM', 'UK', 'www.uk.co.uk', 'GBP', '£', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT '5a7422ce-aed0-4f33-b51b-465e852ed9e2', 'GERMANY', 'DE', 'www.germany.de', 'EUR', '€', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT '5ce41c58-4897-43b1-b494-09f1b2d27d73', 'CANADA', 'CA', 'www.canada.ca', 'CAD', '$', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT '87dfdcf2-2f85-42c0-8eac-82957d98fd08', 'UNITED_STATES', 'US', 'www.usa.gov', 'USD', '$', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT 'a4a3389e-785a-455a-aa7f-c9eb05a9a7e4', 'FRANCE', 'FR', 'www.france.fr', 'EUR', '€', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT 'bb973e14-4ce5-4c90-97a7-04a54d18e541', 'SPAIN', 'ES', 'www.lamoncloa.gob.es', 'EUR', '€', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT 'cdadfc67-5dff-49f3-9b11-a601cc374938', 'AUSTRALIA', 'AU', 'www.australia.gov.au', 'AUD', '$', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b', 'JAPAN', 'JP', 'www.japan.go.jp', 'JPY', '¥', '2026-04-30T00:00:00Z', NULL
  UNION ALL
  SELECT 'f28b71e8-12dd-4e6c-a56c-9cabafb4efcf', 'SOUTH_AFRICA', 'ZA', 'www.gov.za', 'ZAR', 'R', '2026-04-30T00:00:00Z', NULL
) AS seed
WHERE NOT EXISTS (
  SELECT 1 FROM `countries` existing WHERE existing.`ID` = seed.`ID` OR LOWER(existing.`Code`) = LOWER(seed.`Code`)
);

INSERT INTO `schema_migrations` (`ID`, `Name`, `AppliedAt`, `Notes`)
SELECT
  '58f3ad66-a975-4e7f-90b2-bb7a5b0aa8d1',
  '20260430_catalog_and_seed_updates',
  '2026-04-30T00:00:00Z',
  'Adds migration tracking, catalog indexes, and missing calculator type/country seed data. Spain rule payloads were not seeded because the checked-in schema JSON files are empty placeholders.'
WHERE NOT EXISTS (
  SELECT 1 FROM `schema_migrations` existing WHERE existing.`Name` = '20260430_catalog_and_seed_updates'
);

DROP PROCEDURE IF EXISTS `AddIndexIfNotExists`;
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
