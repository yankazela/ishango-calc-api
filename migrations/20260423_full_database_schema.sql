SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- =============================================
-- Helper procedures for idempotent index/constraint creation
-- =============================================

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

DROP PROCEDURE IF EXISTS `AddConstraintIfNotExists`;
DELIMITER //
CREATE PROCEDURE `AddConstraintIfNotExists`(IN p_table VARCHAR(64), IN p_constraint VARCHAR(64), IN p_sql TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = p_table AND CONSTRAINT_NAME = p_constraint LIMIT 1
  ) THEN
    SET @ddl = p_sql;
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

-- =============================================
-- Table definitions
-- =============================================

CREATE TABLE IF NOT EXISTS `calculator_types` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `countries` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Code` varchar(10) NOT NULL,
  `FlagUrl` varchar(200) DEFAULT NULL,
  `Currency` varchar(5) NOT NULL,
  `CurrencySymbol` varchar(5) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `expert_statuses` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `expert_types` (
  `ID` varchar(50) NOT NULL,
  `Code` varchar(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `feature_flags` (
  `id` varchar(50) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL,
  `is_enabled` tinyint NOT NULL DEFAULT '0',
  `created_at` varchar(255) NOT NULL,
  `disabled_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `fx_rates` (
  `ID` varchar(50) NOT NULL,
  `BaseCurrency` varchar(6) NOT NULL,
  `QuoteCurrency` varchar(6) NOT NULL,
  `Rate` decimal(10,4) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `payment_frequencies` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `payment_statuses` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `plans` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `MaxApiCalculationsPerMonth` int DEFAULT NULL,
  `MaxCountries` int DEFAULT NULL,
  `ApiType` varchar(30) NOT NULL,
  `IsMostPopular` tinyint NOT NULL DEFAULT '0',
  `IsCustomPrice` tinyint NOT NULL DEFAULT '0',
  `MaxCalculators` int DEFAULT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `regions` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Code` varchar(50) NOT NULL,
  `Currency` varchar(3) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `subscription_statuses` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `provinces` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Code` varchar(10) NOT NULL,
  `CountryID` varchar(50) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `calculator_countries` (
  `ID` varchar(50) NOT NULL,
  `CalculatorTypeID` varchar(50) NOT NULL,
  `CountryID` varchar(50) NOT NULL,
  `JsonSchema` longtext NOT NULL,
  `WithProvincial` tinyint NOT NULL,
  `Year` varchar(5) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `calculator_provinces` (
  `ID` varchar(50) NOT NULL,
  `CalculatorTypeID` varchar(50) NOT NULL,
  `ProvinceID` varchar(50) NOT NULL,
  `JsonSchema` longtext NOT NULL,
  `Year` varchar(5) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `ID` varchar(50) NOT NULL,
  `StartDate` varchar(20) NOT NULL,
  `CurrentCost` decimal(10,2) NOT NULL,
  `CurrencyRegionCode` varchar(6) NOT NULL,
  `PlanId` varchar(50) NOT NULL,
  `PaymentFrequencyId` varchar(50) NOT NULL,
  `StatusId` varchar(50) NOT NULL,
  `SelectedCalculators` longtext NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `NextRenewalAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `api_keys` (
  `ID` varchar(50) NOT NULL,
  `SubscriptionID` varchar(50) NOT NULL,
  `ApiKey` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `IsActive` tinyint NOT NULL DEFAULT '1',
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `clients` (
  `ID` varchar(50) NOT NULL,
  `Firstname` varchar(100) NOT NULL,
  `Lastname` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone` varchar(12) NOT NULL,
  `CountryDialCode` varchar(5) NOT NULL,
  `Company` varchar(100) NOT NULL,
  `CompanySize` varchar(50) NOT NULL,
  `SubscriptionId` varchar(50) NOT NULL,
  `IsSso` tinyint NOT NULL DEFAULT '1',
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `ID` varchar(50) NOT NULL,
  `SubscriptionID` varchar(50) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `PaymentDate` varchar(20) NOT NULL,
  `TransactionReference` varchar(50) NOT NULL,
  `PaymentMethod` varchar(50) NOT NULL,
  `StatusId` varchar(50) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `plan_prices` (
  `ID` varchar(50) NOT NULL,
  `PlanID` varchar(50) NOT NULL,
  `RegionID` varchar(50) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `experts` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Phone` varchar(50) NOT NULL,
  `Bio` longtext NOT NULL,
  `ProfilePictureUrl` longtext NOT NULL,
  `ExpertTypeID` varchar(50) NOT NULL,
  `Role` varchar(100) NOT NULL,
  `Rating` int NOT NULL,
  `ExpertStatusID` varchar(50) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `expertise_countries` (
  `ID` varchar(50) NOT NULL,
  `ExpertID` varchar(50) NOT NULL,
  `CalculatorCountryID` varchar(50) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `subscription_cost_history` (
  `ID` varchar(50) NOT NULL,
  `SubscriptionID` varchar(50) NOT NULL,
  `PlanID` varchar(50) NOT NULL,
  `Cost` decimal(10,2) NOT NULL,
  `EffectiveDate` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- Indexes
-- =============================================

CALL AddIndexIfNotExists('api_keys', 'PRIMARY', 'ALTER TABLE `api_keys` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('api_keys', 'UQ_api_keys_ApiKey', 'ALTER TABLE `api_keys` ADD UNIQUE KEY `UQ_api_keys_ApiKey` (`ApiKey`)');
CALL AddIndexIfNotExists('api_keys', 'FK_api_keys_SubscriptionID', 'ALTER TABLE `api_keys` ADD KEY `FK_api_keys_SubscriptionID` (`SubscriptionID`)');

CALL AddIndexIfNotExists('calculator_countries', 'PRIMARY', 'ALTER TABLE `calculator_countries` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('calculator_countries', 'FK_6292ab3c1f4ff07bf3a3e5062e5', 'ALTER TABLE `calculator_countries` ADD KEY `FK_6292ab3c1f4ff07bf3a3e5062e5` (`CountryID`)');
CALL AddIndexIfNotExists('calculator_countries', 'FK_c64e05f5b4ba491201748d4bf26', 'ALTER TABLE `calculator_countries` ADD KEY `FK_c64e05f5b4ba491201748d4bf26` (`CalculatorTypeID`)');

CALL AddIndexIfNotExists('calculator_provinces', 'PRIMARY', 'ALTER TABLE `calculator_provinces` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('calculator_provinces', 'FK_03a0eea008eb4ca1ab48a0ca796', 'ALTER TABLE `calculator_provinces` ADD KEY `FK_03a0eea008eb4ca1ab48a0ca796` (`ProvinceID`)');
CALL AddIndexIfNotExists('calculator_provinces', 'FK_1cab8e93ef3d00d2ee6bdc5e9c2', 'ALTER TABLE `calculator_provinces` ADD KEY `FK_1cab8e93ef3d00d2ee6bdc5e9c2` (`CalculatorTypeID`)');

CALL AddIndexIfNotExists('calculator_types', 'PRIMARY', 'ALTER TABLE `calculator_types` ADD PRIMARY KEY (`ID`)');

CALL AddIndexIfNotExists('clients', 'PRIMARY', 'ALTER TABLE `clients` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('clients', 'REL_8e5f1736af0c63dede1ebb3d96', 'ALTER TABLE `clients` ADD UNIQUE KEY `REL_8e5f1736af0c63dede1ebb3d96` (`SubscriptionId`)');

CALL AddIndexIfNotExists('countries', 'PRIMARY', 'ALTER TABLE `countries` ADD PRIMARY KEY (`ID`)');

CALL AddIndexIfNotExists('expertise_countries', 'PRIMARY', 'ALTER TABLE `expertise_countries` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('expertise_countries', 'FK_d7ab0f5de497fc435a3d0a91cdd', 'ALTER TABLE `expertise_countries` ADD KEY `FK_d7ab0f5de497fc435a3d0a91cdd` (`ExpertID`)');
CALL AddIndexIfNotExists('expertise_countries', 'FK_a6271a8878edda40999d505fdb2', 'ALTER TABLE `expertise_countries` ADD KEY `FK_a6271a8878edda40999d505fdb2` (`CalculatorCountryID`)');

CALL AddIndexIfNotExists('experts', 'PRIMARY', 'ALTER TABLE `experts` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('experts', 'FK_6ad235fcff122997f1e497139df', 'ALTER TABLE `experts` ADD KEY `FK_6ad235fcff122997f1e497139df` (`ExpertStatusID`)');
CALL AddIndexIfNotExists('experts', 'FK_694cddab18f832b25c098861aa0', 'ALTER TABLE `experts` ADD KEY `FK_694cddab18f832b25c098861aa0` (`ExpertTypeID`)');

CALL AddIndexIfNotExists('expert_statuses', 'PRIMARY', 'ALTER TABLE `expert_statuses` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('expert_types', 'PRIMARY', 'ALTER TABLE `expert_types` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('feature_flags', 'PRIMARY', 'ALTER TABLE `feature_flags` ADD PRIMARY KEY (`id`)');
CALL AddIndexIfNotExists('fx_rates', 'PRIMARY', 'ALTER TABLE `fx_rates` ADD PRIMARY KEY (`ID`)');

CALL AddIndexIfNotExists('payments', 'PRIMARY', 'ALTER TABLE `payments` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('payments', 'FK_b1e3064068e1a05d37af0fec86a', 'ALTER TABLE `payments` ADD KEY `FK_b1e3064068e1a05d37af0fec86a` (`SubscriptionID`)');
CALL AddIndexIfNotExists('payments', 'FK_c9bf69bfc7ca9ea82aee7091708', 'ALTER TABLE `payments` ADD KEY `FK_c9bf69bfc7ca9ea82aee7091708` (`StatusId`)');

CALL AddIndexIfNotExists('payment_frequencies', 'PRIMARY', 'ALTER TABLE `payment_frequencies` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('payment_statuses', 'PRIMARY', 'ALTER TABLE `payment_statuses` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('plans', 'PRIMARY', 'ALTER TABLE `plans` ADD PRIMARY KEY (`ID`)');

CALL AddIndexIfNotExists('plan_prices', 'PRIMARY', 'ALTER TABLE `plan_prices` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('plan_prices', 'FK_09bd528f83f3908d5fad945e81f', 'ALTER TABLE `plan_prices` ADD KEY `FK_09bd528f83f3908d5fad945e81f` (`PlanID`)');
CALL AddIndexIfNotExists('plan_prices', 'FK_46cfee5eb5534e1e3256332f606', 'ALTER TABLE `plan_prices` ADD KEY `FK_46cfee5eb5534e1e3256332f606` (`RegionID`)');

CALL AddIndexIfNotExists('provinces', 'PRIMARY', 'ALTER TABLE `provinces` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('provinces', 'FK_8c1f4aad8475be025242b8b0e57', 'ALTER TABLE `provinces` ADD KEY `FK_8c1f4aad8475be025242b8b0e57` (`CountryID`)');

CALL AddIndexIfNotExists('regions', 'PRIMARY', 'ALTER TABLE `regions` ADD PRIMARY KEY (`ID`)');

CALL AddIndexIfNotExists('subscriptions', 'PRIMARY', 'ALTER TABLE `subscriptions` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('subscriptions', 'FK_c72d661e6de8eb5820b6c6ea9e0', 'ALTER TABLE `subscriptions` ADD KEY `FK_c72d661e6de8eb5820b6c6ea9e0` (`PlanId`)');
CALL AddIndexIfNotExists('subscriptions', 'FK_1422f649c9c8c83ef5a675e0aff', 'ALTER TABLE `subscriptions` ADD KEY `FK_1422f649c9c8c83ef5a675e0aff` (`PaymentFrequencyId`)');
CALL AddIndexIfNotExists('subscriptions', 'FK_38a821d7b1cc006b3aea7fb8d10', 'ALTER TABLE `subscriptions` ADD KEY `FK_38a821d7b1cc006b3aea7fb8d10` (`StatusId`)');

CALL AddIndexIfNotExists('subscription_cost_history', 'PRIMARY', 'ALTER TABLE `subscription_cost_history` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('subscription_cost_history', 'FK_3d117809e14d93b8664ce50c9d6', 'ALTER TABLE `subscription_cost_history` ADD KEY `FK_3d117809e14d93b8664ce50c9d6` (`SubscriptionID`)');
CALL AddIndexIfNotExists('subscription_cost_history', 'FK_ef5f6c8a3d3b5ed301d4db0a112', 'ALTER TABLE `subscription_cost_history` ADD KEY `FK_ef5f6c8a3d3b5ed301d4db0a112` (`PlanID`)');

CALL AddIndexIfNotExists('subscription_statuses', 'PRIMARY', 'ALTER TABLE `subscription_statuses` ADD PRIMARY KEY (`ID`)');

-- =============================================
-- Constraints
-- =============================================

CALL AddConstraintIfNotExists('api_keys', 'FK_api_keys_SubscriptionID', 'ALTER TABLE `api_keys` ADD CONSTRAINT `FK_api_keys_SubscriptionID` FOREIGN KEY (`SubscriptionID`) REFERENCES `subscriptions` (`ID`)');

CALL AddConstraintIfNotExists('calculator_countries', 'FK_6292ab3c1f4ff07bf3a3e5062e5', 'ALTER TABLE `calculator_countries` ADD CONSTRAINT `FK_6292ab3c1f4ff07bf3a3e5062e5` FOREIGN KEY (`CountryID`) REFERENCES `countries` (`ID`)');
CALL AddConstraintIfNotExists('calculator_countries', 'FK_c64e05f5b4ba491201748d4bf26', 'ALTER TABLE `calculator_countries` ADD CONSTRAINT `FK_c64e05f5b4ba491201748d4bf26` FOREIGN KEY (`CalculatorTypeID`) REFERENCES `calculator_types` (`ID`)');

CALL AddConstraintIfNotExists('calculator_provinces', 'FK_03a0eea008eb4ca1ab48a0ca796', 'ALTER TABLE `calculator_provinces` ADD CONSTRAINT `FK_03a0eea008eb4ca1ab48a0ca796` FOREIGN KEY (`ProvinceID`) REFERENCES `provinces` (`ID`)');
CALL AddConstraintIfNotExists('calculator_provinces', 'FK_1cab8e93ef3d00d2ee6bdc5e9c2', 'ALTER TABLE `calculator_provinces` ADD CONSTRAINT `FK_1cab8e93ef3d00d2ee6bdc5e9c2` FOREIGN KEY (`CalculatorTypeID`) REFERENCES `calculator_types` (`ID`)');

CALL AddConstraintIfNotExists('clients', 'FK_8e5f1736af0c63dede1ebb3d969', 'ALTER TABLE `clients` ADD CONSTRAINT `FK_8e5f1736af0c63dede1ebb3d969` FOREIGN KEY (`SubscriptionId`) REFERENCES `subscriptions` (`ID`)');

CALL AddConstraintIfNotExists('expertise_countries', 'FK_a6271a8878edda40999d505fdb2', 'ALTER TABLE `expertise_countries` ADD CONSTRAINT `FK_a6271a8878edda40999d505fdb2` FOREIGN KEY (`CalculatorCountryID`) REFERENCES `calculator_countries` (`ID`)');
CALL AddConstraintIfNotExists('expertise_countries', 'FK_d7ab0f5de497fc435a3d0a91cdd', 'ALTER TABLE `expertise_countries` ADD CONSTRAINT `FK_d7ab0f5de497fc435a3d0a91cdd` FOREIGN KEY (`ExpertID`) REFERENCES `experts` (`ID`)');

CALL AddConstraintIfNotExists('experts', 'FK_694cddab18f832b25c098861aa0', 'ALTER TABLE `experts` ADD CONSTRAINT `FK_694cddab18f832b25c098861aa0` FOREIGN KEY (`ExpertTypeID`) REFERENCES `expert_types` (`ID`)');
CALL AddConstraintIfNotExists('experts', 'FK_6ad235fcff122997f1e497139df', 'ALTER TABLE `experts` ADD CONSTRAINT `FK_6ad235fcff122997f1e497139df` FOREIGN KEY (`ExpertStatusID`) REFERENCES `expert_statuses` (`ID`)');

CALL AddConstraintIfNotExists('payments', 'FK_b1e3064068e1a05d37af0fec86a', 'ALTER TABLE `payments` ADD CONSTRAINT `FK_b1e3064068e1a05d37af0fec86a` FOREIGN KEY (`SubscriptionID`) REFERENCES `subscriptions` (`ID`)');
CALL AddConstraintIfNotExists('payments', 'FK_c9bf69bfc7ca9ea82aee7091708', 'ALTER TABLE `payments` ADD CONSTRAINT `FK_c9bf69bfc7ca9ea82aee7091708` FOREIGN KEY (`StatusId`) REFERENCES `payment_statuses` (`ID`)');

CALL AddConstraintIfNotExists('plan_prices', 'FK_09bd528f83f3908d5fad945e81f', 'ALTER TABLE `plan_prices` ADD CONSTRAINT `FK_09bd528f83f3908d5fad945e81f` FOREIGN KEY (`PlanID`) REFERENCES `plans` (`ID`)');
CALL AddConstraintIfNotExists('plan_prices', 'FK_46cfee5eb5534e1e3256332f606', 'ALTER TABLE `plan_prices` ADD CONSTRAINT `FK_46cfee5eb5534e1e3256332f606` FOREIGN KEY (`RegionID`) REFERENCES `regions` (`ID`)');

CALL AddConstraintIfNotExists('provinces', 'FK_8c1f4aad8475be025242b8b0e57', 'ALTER TABLE `provinces` ADD CONSTRAINT `FK_8c1f4aad8475be025242b8b0e57` FOREIGN KEY (`CountryID`) REFERENCES `countries` (`ID`)');

CALL AddConstraintIfNotExists('subscriptions', 'FK_1422f649c9c8c83ef5a675e0aff', 'ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_1422f649c9c8c83ef5a675e0aff` FOREIGN KEY (`PaymentFrequencyId`) REFERENCES `payment_frequencies` (`ID`)');
CALL AddConstraintIfNotExists('subscriptions', 'FK_38a821d7b1cc006b3aea7fb8d10', 'ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_38a821d7b1cc006b3aea7fb8d10` FOREIGN KEY (`StatusId`) REFERENCES `subscription_statuses` (`ID`)');
CALL AddConstraintIfNotExists('subscriptions', 'FK_c72d661e6de8eb5820b6c6ea9e0', 'ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_c72d661e6de8eb5820b6c6ea9e0` FOREIGN KEY (`PlanId`) REFERENCES `plans` (`ID`)');

CALL AddConstraintIfNotExists('subscription_cost_history', 'FK_3d117809e14d93b8664ce50c9d6', 'ALTER TABLE `subscription_cost_history` ADD CONSTRAINT `FK_3d117809e14d93b8664ce50c9d6` FOREIGN KEY (`SubscriptionID`) REFERENCES `subscriptions` (`ID`)');
CALL AddConstraintIfNotExists('subscription_cost_history', 'FK_ef5f6c8a3d3b5ed301d4db0a112', 'ALTER TABLE `subscription_cost_history` ADD CONSTRAINT `FK_ef5f6c8a3d3b5ed301d4db0a112` FOREIGN KEY (`PlanID`) REFERENCES `plans` (`ID`)');

-- =============================================
-- Cleanup helper procedures
-- =============================================

DROP PROCEDURE IF EXISTS `AddIndexIfNotExists`;
DROP PROCEDURE IF EXISTS `AddConstraintIfNotExists`;
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
