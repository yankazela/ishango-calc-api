-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 17, 2026 at 01:38 PM
-- Server version: 8.0.44
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `Ishango_SAAS` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `Ishango_SAAS`;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Ishango_SAAS`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `calculator_countries`
--

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

--
-- Dumping data for table `calculator_countries`
--

INSERT INTO `calculator_countries` (`ID`, `CalculatorTypeID`, `CountryID`, `JsonSchema`, `WithProvincial`, `Year`, `CreatedAt`, `DisabledAt`) VALUES
('\n7b22e1f8-8545-4d20-9a74-55001a66a9a7', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', '103e8f49-f86a-4312-8cb9-511f872e5d84', '{\n  \"meta\": {\n    \"id\": \"ukMortgage\",\n    \"country\": \"GB\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"MORTGAGE\",\n    \"version\": \"2024.1\",\n    \"effectiveFrom\": \"2024-04-01\",\n    \"effectiveTo\": null,\n    \"currency\": \"GBP\",\n    \"currencySymbol\": \"£\",\n    \"source\": [\n      {\n        \"name\": \"UK Government (Stamp Duty Land Tax guidance)\",\n        \"url\": \"https://www.gov.uk/stamp-duty-land-tax\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"propertyPrice\",\n      \"label\": \"PROPERTY_PRICE\",\n      \"type\": \"number\",\n      \"isCurrency\": true,\n      \"required\": true,\n      \"unit\": \"GBP\"\n    },\n    {\n      \"name\": \"downPayment\",\n      \"label\": \"DOWN_PAYMENT\",\n      \"type\": \"number\",\n      \"isCurrency\": true,\n      \"required\": true,\n      \"unit\": \"GBP\",\n     \"slider\": { \"max\": 50, \"min\": 0, \"step\": 1 }\n    },\n    {\n      \"name\": \"interestRate\",\n      \"label\": \"INTEREST_RATE\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"percent\",\n      \"slider\": { \"max\": 15, \"min\": 0.5, \"step\": 0.1 }\n   },\n    {\n      \"name\": \"amortizationYears\",\n      \"label\": \"LOAN_DURATION\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"min\": 1\n    },\n    {\n      \"name\": \"isFirstTimeBuyer\",\n      \"label\": \"IS_FIRST_TIME_BUYER\",\n      \"type\": \"boolean\",\n      \"required\": true\n    }\n  ],\n  \"outputs\": [\n    {\n      \"id\": \"loanAmount\",\n      \"label\": \"Loan amount\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"monthlyPayment\",\n      \"label\": \"Monthly payment\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"totalPaid\",\n      \"label\": \"Total paid over term\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"stampDuty\",\n      \"label\": \"Stamp Duty Land Tax (SDLT)\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"amortizationSchedule\",\n      \"label\": \"Yearly amortization schedule\",\n      \"type\": \"array\",\n      \"items\": {\n        \"type\": \"object\",\n        \"properties\": {\n          \"year\": { \"type\": \"integer\" },\n          \"balance\": { \"type\": \"money\", \"currency\": \"GBP\" }\n        }\n      }\n    },\n    {\n      \"id\": \"otherFees\",\n      \"label\": \"Other fees\",\n      \"type\": \"object\"\n    }\n  ],\n  \"rules\": {\n  \"loanConstraints\": {\n    \"maxLtvPercent\": 95,\n    \"maxAmortizationYears\": 35\n  },\n  \"interest\": {\n    \"compounding\": \"MONTHLY\"\n  },\n  \"stampDuty\": {\n    \"standardBrackets\": [\n      { \"upTo\": 250000, \"rate\": 0 },\n      { \"upTo\": 925000, \"rate\": 0.05 },\n      { \"upTo\": 1500000, \"rate\": 0.1 },\n      { \"above\": 1500000, \"rate\": 0.12 }\n    ],\n    \"firstTimeBuyer\": {\n      \"brackets\": [\n        { \"upTo\": 425000, \"rate\": 0 },\n        { \"upTo\": 625000, \"rate\": 0.05 }\n      ],\n      \"maxEligiblePropertyPrice\": 625000\n    }\n  }\n},\n    \"aggregates\": {\n      \"totalPaid\": \"monthlyPayment * (amortizationYears * 12)\",\n      \"otherFees\": {\n        \"notaryFees\": {\n          \"label\": \"STAMP_DUTY\",\n          \"value\": \"stampDuty\"\n        }\n      },\n      \"amortizationSchedule\": \"Generate yearly schedule of remaining balance for each year 1..amortizationYears; final year balance should be ~0\"\n    }\n}', 0, '2025', '', NULL),
('02fcd591-dace-4a7b-a36b-93034bc87b1a', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', '5a7422ce-aed0-4f33-b51b-465e852ed9e2', '{\n  \"meta\": {\n    \"id\": \"germanyCorporateTaxCalculator\",\n    \"country\": \"GE\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CORPORATE_TAX\",\n    \"version\": \"2025.1\",\n    \"effectiveFrom\": \"2025-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"EUR\",\n    \"currencySymbol\": \"€\",\n    \"source\": [\n      {\n        \"name\": \"Germany revenue\",\n        \"url\": \"https://www.germany-tax.ge\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"taxableIncome\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"ZAR\",\n      \"isCurrency\": true,\n      \"label\": \"TAXABLE_INCOME\"\n    },\n    {\n      \"name\": \"isSmallBusiness\",\n      \"type\": \"boolean\",\n      \"required\": true,\n      \"label\": \"IS_SMALL_BUSINESS\"\n    }\n  ],\n  \"outputs\": [ ],\n  \"rules\": {\n        \"corporateIncomeTax\": { \"rate\": 0.15 },\n        \"solidaritySurcharge\": { \"rate\": 0.055 },\n        \"tradeTax\": { \"multiplier\": 0.035, \"assessmentRate\": 4.0 }\n    }\n}', 0, '2025', '', NULL),
('1003f505-6e9f-4b06-b880-8fe75a6fc633', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', 'f28b71e8-12dd-4e6c-a56c-9cabafb4efcf', '{\r\n  \"meta\": {\r\n    \"id\": \"southAfricaIncomeTax\",\r\n    \"country\": \"ZA\",\r\n    \"region\": \"NATIONAL\",\r\n    \"calculator\": \"INCOME_TAX\",\r\n    \"version\": \"2024.2\",\r\n    \"effectiveFrom\": \"2024-03-01\",\r\n    \"effectiveTo\": null,\r\n    \"currency\": \"ZAR\",\r\n    \"currencySymbol\": \"R\",\r\n    \"source\": [\r\n      {\r\n        \"name\": \"South African Revenue Service (SARS)\",\r\n        \"url\": \"https://www.sars.gov.za\"\r\n      }\r\n    ]\r\n  },\r\n\r\n  \"inputs\": [\r\n    {\r\n      \"name\": \"income\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"unit\": \"ZAR\",\r\n      \"isCurrency\": true,\r\n      \"label\": \"ANNUAL_GROSS_INCOME\"\r\n    },\r\n    {\r\n      \"name\": \"age\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"label\": \"AGE\"\r\n    },\r\n    {\r\n      \"name\": \"medicalAidMembers\",\r\n      \"type\": \"number\",\r\n      \"required\": false,\r\n      \"default\": 0,\r\n      \"label\": \"TOTAL_MEDICAL_AID_MEMBERS\"\r\n    }\r\n  ],\r\n\r\n  \"outputs\": [\r\n    {\r\n      \"name\": \"incomeTax\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"ZAR\"\r\n    },\r\n    {\r\n      \"name\": \"uif\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"ZAR\"\r\n    },\r\n    {\r\n      \"name\": \"netIncome\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"ZAR\"\r\n    },\r\n    {\r\n      \"name\": \"effectiveTaxRate\",\r\n      \"type\": \"number\"\r\n    }\r\n  ],\r\n\r\n  \"rules\": {\r\n    \"taxBrackets\": [\r\n      { \"from\": 0, \"to\": 237100, \"rate\": 0.18 },\r\n      { \"from\": 237101, \"to\": 370500, \"rate\": 0.26 },\r\n      { \"from\": 370501, \"to\": 512800, \"rate\": 0.31 },\r\n      { \"from\": 512801, \"to\": 673000, \"rate\": 0.36 },\r\n      { \"from\": 673001, \"to\": 857900, \"rate\": 0.39 },\r\n      { \"from\": 857901, \"to\": 1817000, \"rate\": 0.41 },\r\n      { \"from\": 1817001, \"to\": null, \"rate\": 0.45 }\r\n    ],\r\n    \"loanConstraints\": {\r\n       \"maxDebtToIncomePercent\": 45,\r\n       \"stressInterestRateBuffer\": 2.0,\r\n       \"maxLoanTermYears\": 25\r\n    },\r\n    \"rebates\": {\r\n      \"primary\": {\r\n        \"ageMin\": 0,\r\n        \"amount\": 17235\r\n      },\r\n      \"secondary\": {\r\n        \"ageMin\": 65,\r\n        \"amount\": 9444\r\n      },\r\n      \"tertiary\": {\r\n        \"ageMin\": 75,\r\n        \"amount\": 3145\r\n      }\r\n    },\r\n\r\n    \"taxThresholds\": {\r\n      \"under65\": 95750,\r\n      \"age65To74\": 148217,\r\n      \"age75Plus\": 165689\r\n    },\r\n\r\n    \"medicalAidTaxCredit\": {\r\n      \"monthly\": {\r\n        \"taxpayer\": 364,\r\n        \"firstDependant\": 364,\r\n        \"additionalDependant\": 246\r\n      },\r\n      \"annualMultiplier\": 12\r\n    },\r\n\r\n    \"uif\": {\r\n      \"rate\": 0.01,\r\n      \"annualIncomeCap\": 212544,\r\n      \"maxAnnualContribution\": 2125.44\r\n    }\r\n  }\r\n}\r\n', 0, '2025', '', NULL),
('114207ca-4f95-406a-bb6b-5b0f36081fd1', 'de10134b-ffab-4835-b608-592934b4331e', '103e8f49-f86a-4312-8cb9-511f872e5d84', '{\n  \"meta\": {\n    \"id\": \"uk-capital-gains\",\n    \"country\": \"UK\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CAPITAL_GAINS\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-01-01\",\n    \"effectiveTo\": null,\n    \"source\": [\n      { \"name\": \"HM Revenue & Customs (HMRC)\", \"url\": \"https://www.gov.uk/government/organisations/hm-revenue-customs\" }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"capitalGain\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"GBP\",\n      \"isCurrency\": true,\n      \"label\": \"CAPITAL_GAIN\"\n    },\n     {\n      \"name\": \"totalTaxableIncome\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"GBP\",\n      \"isCurrency\": true,\n      \"label\": \"TOTAL_TAXABLE_INCOME\"\n    }\n  ],\n  \"outputs\": [\n    { \"name\": \"taxableCapitalGain\", \"type\": \"number\", \"unit\": \"GBP\" },\n    { \"name\": \"capitalGainsTax\", \"type\": \"number\", \"unit\": \"GBP\" },\n    { \"name\": \"effectiveRate\", \"type\": \"number\", \"unit\": \"PERCENT\" }\n  ],\n  \"rules\": {\n        \"annualExemption\": 3000,\n        \"basicRate\": 0.10,\n        \"higherRate\": 0.20,\n        \"basicRateLimit\": 37700\n    }\n  }', 0, '2025', '', NULL),
('176fbb05-a321-435a-9eff-dccb60bf6008', 'de10134b-ffab-4835-b608-592934b4331e', '5a7422ce-aed0-4f33-b51b-465e852ed9e2', '{\n  \"meta\": {\n    \"id\": \"ge-capital-gains\",\n    \"country\": \"GE\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CAPITAL_GAINS\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-01-01\",\n    \"effectiveTo\": null,\n    \"source\": [\n      { \"name\": \"Bundesministerium der Finanzen (BMF)\", \"url\": \"https://www.bundesfinanzministerium.de\" }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"capitalGain\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"EUR\",\n      \"isCurrency\": true,\n      \"label\": \"CAPITAL_GAIN\"\n    }\n  ],\n  \"outputs\": [\n    { \"name\": \"taxableCapitalGain\", \"type\": \"number\", \"unit\": \"EUR\" },\n    { \"name\": \"capitalGainsTax\", \"type\": \"number\", \"unit\": \"EUR\" },\n    { \"name\": \"solidaritySurcharge\", \"type\": \"number\", \"unit\": \"EUR\" },\n    { \"name\": \"totalTax\", \"type\": \"number\", \"unit\": \"EUR\" },\n    { \"name\": \"effectiveRate\", \"type\": \"number\", \"unit\": \"PERCENT\" }\n  ],\n  \"rules\": {\n\n    \"flatTaxRate\": 0.25,\n    \"solidaritySurchargeRate\": 0.055,\n    \"annualExemption\": 1000\n\n  }\n}', 0, '2025', '', NULL),
('18892c51-79b9-424b-896d-f27ac635cfd6', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b', '{\"meta\":{\"id\":\"japanMortgage\",\"country\":\"JP\",\"region\":\"NATIONAL\",\"calculator\":\"MORTGAGE\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"JPY\",\"currencySymbol\":\"¥\",\"source\":[{\"name\":\"Financial Services Agency Japan\",\"url\":\"https://www.fsa.go.jp\"}]},\"inputs\":[{\"type\":\"number\",\"min\":1,\"isCurrency\":true,\"label\":\"PROPERTY_PRICE\",\"name\":\"propertyPrice\"},{\"type\":\"number\",\"min\":0,\"isCurrency\":true,\"label\":\"DOWN_PAYMENT\",\"slider\":{\"max\":50,\"min\":0,\"step\":1},\"name\":\"downPayment\"},{\"type\":\"number\",\"min\":0,\"label\":\"INTEREST_RATE\",\"slider\":{\"max\":10,\"min\":0.1,\"step\":0.1},\"name\":\"interestRate\"},{\"type\":\"number\",\"min\":1,\"label\":\"LOAN_DURATION\",\"name\":\"amortizationYears\"},{\"type\":\"boolean\",\"label\":\"IS_FIRST_TIME_BUYER\",\"name\":\"isFirstTimeBuyer\"}],\"outputs\":[],\"rules\":{\"loanConstraints\":{\"maxLtvPercent\":90,\"maxAmortizationYears\":35},\"interest\":{\"compounding\":\"MONTHLY\"},\"acquisitionTax\":{\"rate\":0.03}}}', 0, '2025', '', NULL),
('1e6cdbf9-216d-4487-ab66-8f0f3c37e1f9', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '{\n  \"meta\": {\n    \"id\": \"caInheritanceTax\",\n    \"country\": \"CA\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INHERITANCE_TAX\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"CAD\",\n    \"currencySymbol\": \"$\",\n    \"source\": [\n      {\n        \"name\": \"Canada Revenue Agency (CRA)\",\n        \"url\": \"https://www.canada.ca/en/revenue-agency.html\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"estateValue\",\n      \"label\": \"ESTATE_VALUE\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"CAD\",\n      \"isCurrency\": true\n    },\n    {\n        \"name\": \"adjustedCostBase\",\n        \"label\": \"ADJUSTED_COST_BASE\",\n        \"type\": \"number\",\n        \"required\": true,\n        \"unit\": \"CAD\",\n        \"isCurrency\": true\n    }\n  ],\n  \"outputs\": [],\n  \"rules\": {\n    \"inclusionRate\": 0.50,\n    \"taxBrackets\": [\n        { \"from\": 0, \"to\": 55867, \"rate\": 0.15 },\n        { \"from\": 55867, \"to\": 111733, \"rate\": 0.205 },\n        { \"from\": 111733, \"to\": 154906, \"rate\": 0.26 },\n        { \"from\": 154906, \"to\": 220000, \"rate\": 0.29 },\n        { \"from\": 220000, \"to\": null, \"rate\": 0.33 }\n    ]\n}\n}', 0, '2025', '', NULL),
('2b8e54a1-c773-4838-a184-45f46f0b4b5d', 'de10134b-ffab-4835-b608-592934b4331e', '08891a23-c70c-4fc3-a7d4-47ec69d3ea13', '{\"meta\":{\"id\":\"in-capital-gains\",\"country\":\"IN\",\"region\":\"NATIONAL\",\"calculator\":\"CAPITAL_GAINS\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-04-01\",\"effectiveTo\":null,\"currency\":\"INR\",\"currencySymbol\":\"₹\",\"source\":[{\"name\":\"Income Tax Department India\",\"url\":\"https://www.incometax.gov.in\"}]},\"inputs\":[{\"name\":\"capitalGain\",\"type\":\"number\",\"required\":true,\"unit\":\"INR\",\"isCurrency\":true,\"label\":\"CAPITAL_GAIN\"},{\"name\":\"holdingPeriodMonths\",\"type\":\"number\",\"required\":false,\"label\":\"HOLDING_PERIOD_MONTHS\"}],\"outputs\":[],\"rules\":{\"shortTermRate\":0.20,\"longTermRate\":0.125,\"longTermExemption\":125000}}', 0, '2026', '', NULL),
('34a9028a-272e-4791-a957-462cd4808eae', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', 'cdadfc67-5dff-49f3-9b11-a601cc374938', '{\n  \"meta\": {\n    \"id\": \"auInheritanceTax\",\n    \"country\": \"AU\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INHERITANCE_TAX\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"AUD\",\n    \"currencySymbol\": \"$\",\n    \"source\": [\n      {\n        \"name\": \"HM Revenue & Customs (HMRC)\",\n        \"url\": \"https://www.gov.uk/government/organisations/hm-revenue-customs\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"estateValue\",\n      \"label\": \"ESTATE_VALUE\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"AUD\",\n      \"isCurrency\": true\n    }\n  ],\n  \"outputs\": [],\n  \"rules\": {\n    \"applicable\": false\n}\n}', 0, '2025', '', NULL),
('367e94cc-0a0a-4d8d-8f05-530b4e51b1a4', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', 'a4a3389e-785a-455a-aa7f-c9eb05a9a7e4', '{\r\n  \"meta\": {\r\n    \"id\": \"france-income-tax\",\r\n    \"country\": \"FR\",\r\n    \"region\": \"NATIONAL\",\r\n    \"calculator\": \"INCOME_TAX\",\r\n    \"version\": \"2025.1\",\r\n    \"effectiveFrom\": \"2025-01-01\",\r\n    \"effectiveTo\": null,\r\n    \"currencySymbol\": \"€\",\r\n    \"source\": [\r\n      {\r\n        \"name\": \"Direction Générale des Finances Publiques\",\r\n        \"url\": \"https://www.impots.gouv.fr\"\r\n      }\r\n    ]\r\n  },\r\n\r\n  \"inputs\": [\r\n    {\r\n      \"name\": \"income\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"unit\": \"EUR\",\r\n      \"isCurrency\": true,\r\n      \"label\": \"ANNUAL_GROSS_INCOME\"\r\n    },\r\n    {\r\n      \"name\": \"family_parts\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"default\": 1,\r\n      \"label\": \"TOTAL_FAMILY_MEMBERS\"\r\n    }\r\n  ],\r\n\r\n  \"outputs\": [\r\n    {\r\n      \"name\": \"incomeTax\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"EUR\",\r\n      \"label\": \"ANNUAL_GROSS_INCOME\"\r\n    },\r\n    {\r\n      \"name\": \"socialContributions\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"EUR\",\r\n      \"label\": \"SOCIAL_CONTRIBUTIONS\"\r\n    },\r\n    {\r\n      \"name\": \"netIncome\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"EUR\",\r\n      \"label\": \"ANNUAL_NET_INCOME\"\r\n    }\r\n  ],\r\n\r\n  \"rules\": {\r\n    \"quotientFamilial\": {\r\n      \"enabled\": true\r\n    },\r\n\r\n    \"taxBrackets\": [\r\n      {\r\n        \"from\": 0,\r\n        \"to\": 11294,\r\n        \"rate\": 0\r\n      },\r\n      {\r\n        \"from\": 11294,\r\n        \"to\": 28797,\r\n        \"rate\": 0.11\r\n      },\r\n      {\r\n        \"from\": 28797,\r\n        \"to\": 82341,\r\n        \"rate\": 0.30\r\n      },\r\n      {\r\n        \"from\": 82341,\r\n        \"to\": 177106,\r\n        \"rate\": 0.41\r\n      },\r\n      {\r\n        \"from\": 177106,\r\n        \"to\": null,\r\n        \"rate\": 0.45\r\n      }\r\n    ],\r\n\r\n    \"socialContributions\": {\r\n      \"employee\": {\r\n        \"rate\": 0.22\r\n      }\r\n    }\r\n  }\r\n}\r\n', 0, '2025', '', NULL),
('433e47a0-b64a-4bae-a3ee-77d42a1a6ab9', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', 'a4a3389e-785a-455a-aa7f-c9eb05a9a7e4', '{\n  \"meta\": {\n    \"id\": \"frInheritanceTax\",\n    \"country\": \"FR\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INHERITANCE_TAX\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"EUR\",\n    \"currencySymbol\": \"€\",\n    \"source\": [\n      {\n        \"name\": \"Internal Revenue Service (IRS)\",\n        \"url\": \"https://www.irs.gov/\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"estateValue\",\n      \"label\": \"ESTATE_VALUE\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"EUR\",\n      \"isCurrency\": true\n    },\n    {\n        \"name\": \"relationship\",\n        \"label\": \"RELATIONSHIP\",\n        \"type\": \"select\",\n        \"required\": true,\n        \"options\": [\n            { \"value\": \"spouse\", \"label\": \"SPOUSE\" },\n            { \"value\": \"child\", \"label\": \"CHILD\" },\n            { \"value\": \"sibling\", \"label\": \"SIBLING\" },\n            { \"value\": \"other\", \"label\": \"OTHER\" }\n        ]\n    }\n  ],\n  \"outputs\": [],\n  \"rules\": {\n    \"relationships\": {\n        \"spouse\": {\n            \"exemption\": 1000000000000000000000000000000,\n            \"brackets\": []\n        },\n        \"child\": {\n            \"exemption\": 100000,\n            \"brackets\": [\n                { \"from\": 0, \"to\": 8072, \"rate\": 0.05 },\n                { \"from\": 8072, \"to\": 12109, \"rate\": 0.10 },\n                { \"from\": 12109, \"to\": 15932, \"rate\": 0.15 },\n                { \"from\": 15932, \"to\": 552324, \"rate\": 0.20 },\n                { \"from\": 552324, \"to\": 902838, \"rate\": 0.30 },\n                { \"from\": 902838, \"to\": 1805677, \"rate\": 0.40 },\n                { \"from\": 1805677, \"to\": null, \"rate\": 0.45 }\n            ]\n        },\n        \"sibling\": {\n            \"exemption\": 15932,\n            \"brackets\": [\n                { \"from\": 0, \"to\": 24430, \"rate\": 0.35 },\n                { \"from\": 24430, \"to\": null, \"rate\": 0.45 }\n            ]\n        },\n        \"other\": {\n            \"exemption\": 1594,\n            \"brackets\": [\n                { \"from\": 0, \"to\": null, \"rate\": 0.60 }\n            ]\n        }\n    }\n}\n}', 0, '2025', '', NULL),
('45fd5b41-e995-40f7-8268-62f9088083ae', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', 'a4a3389e-785a-455a-aa7f-c9eb05a9a7e4', '{\r\n  \"meta\": {\r\n    \"id\": \"france-mortgage-rules\",\r\n    \"country\": \"FR\",\r\n    \"region\": \"NATIONAL\",\r\n    \"calculator\": \"MORTGAGE\",\r\n    \"version\": \"2025.1\",\r\n    \"effectiveFrom\": \"2025-01-01\",\r\n    \"effectiveTo\": null,\r\n    \"currency\": \"EUR\",\r\n    \"currencySymbol\": \"€\",\r\n    \"source\": [\r\n      {\r\n        \"name\": \"Haut Conseil de Stabilité Financière (HCSF)\",\r\n        \"url\": \"https://www.economie.gouv.fr/hcsf\"\r\n      },\r\n      {\r\n        \"name\": \"Banque de France\",\r\n        \"url\": \"https://www.banque-france.fr\"\r\n      }\r\n    ]\r\n  },\r\n\r\n  \"inputs\": [\r\n    {\r\n      \"name\": \"propertyPrice\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"unit\": \"EUR\",\r\n      \"isCurrency\": true,\r\n      \"label\": \"PROPERTY_PRICE\"\r\n    },\r\n    {\r\n      \"name\": \"annualIncome\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"unit\": \"EUR\",\r\n      \"isCurrency\": true,\r\n      \"label\": \"ANNUAL_GROSS_INCOME\"\r\n    },\r\n    { \r\n       \"name\": \"downPayment\",\r\n       \"type\": \"number\",\r\n       \"min\": 0, \r\n       \"unit\": \"EUR\",\r\n       \"isCurrency\": true,\r\n       \"label\": \"DOWN_PAYMENT\",\r\n       \"slider\": { \"max\": 50, \"min\": 0, \"step\": 1 }\r\n     },\r\n     {\r\n       \"name\": \"interestRate\",\r\n       \"type\": \"number\",\r\n       \"min\": 0,\r\n       \"unit\": \"EUR\",\r\n       \"isCurrency\": true,\r\n       \"label\": \"INTEREST_RATE\",\r\n       \"slider\": { \"max\": 15, \"min\": 0.5, \"step\": 0.1 }\r\n    },\r\n    {\r\n      \"name\": \"amortizationYears\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"label\": \"LOAN_DURATION\"\r\n    }\r\n  ],\r\n\r\n  \"outputs\": [\r\n    { \"name\": \"loanAmount\", \"type\": \"number\", \"unit\": \"EUR\" },\r\n    { \"name\": \"monthlyPayment\", \"type\": \"number\", \"unit\": \"EUR\" },\r\n    { \"name\": \"totalInterest\", \"type\": \"number\", \"unit\": \"EUR\" },\r\n    { \"name\": \"debtRatio\", \"type\": \"number\" },\r\n    { \"name\": \"isEligible\", \"type\": \"boolean\" }\r\n  ],\r\n\r\n  \"rules\": {\r\n    \"maxDebtRatio\": 0.35,\r\n    \"maxLoanDurationYears\": 25,\r\n    \"maxLoanDurationNewBuildYears\": 27,\r\n    \"minDownPaymentRate\": 0.10,\r\n\r\n    \"firstTimeBuyer\": {\r\n      \"enabled\": true,\r\n      \"maxDebtRatio\": 0.40,\r\n      \"maxLoanDurationYears\": 27,\r\n      \"quotaDisclaimer\": \"Subject to bank quota limits (HCSF 20% rule)\",\r\n      \"requiresPrimaryResidence\": true\r\n    },\r\n\r\n    \"insurance\": {\r\n      \"averageRate\": 0.003,\r\n      \"includedInDebtRatio\": true\r\n    },\r\n\r\n    \"fees\": {\r\n      \"notaryRateOldProperty\": 0.08,\r\n      \"notaryRateNewProperty\": 0.025,\r\n      \"bankFeesRate\": 0.01\r\n    },\r\n\r\n    \"stressTest\": {\r\n      \"interestRateBuffer\": 0.01\r\n    }\r\n  }\r\n}\r\n', 0, '2025', '', NULL),
('52d900d0-099d-48c6-8834-ef83e001ffd8', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b', '{\"meta\":{\"id\":\"japanCorporateTax\",\"country\":\"JP\",\"region\":\"NATIONAL\",\"calculator\":\"CORPORATE_TAX\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"JPY\",\"currencySymbol\":\"¥\",\"source\":[{\"name\":\"National Tax Agency Japan\",\"url\":\"https://www.nta.go.jp\"}]},\"inputs\":[{\"name\":\"taxableIncome\",\"type\":\"number\",\"required\":true,\"unit\":\"JPY\",\"isCurrency\":true,\"label\":\"TAXABLE_INCOME\"}],\"outputs\":[],\"rules\":{\"regime\":{\"type\":\"flat\",\"rate\":0.2344}}}', 0, '2025', '', NULL),
('5760564e-b529-48fa-aa9e-2c51b63e2e54', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', '5a7422ce-aed0-4f33-b51b-465e852ed9e2', '{\n  \"meta\": {\n    \"id\": \"germanyTax\",\n    \"country\": \"GE\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INCOME_TAX\",\n    \"version\": \"2025.1\",\n    \"effectiveFrom\": \"2025-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"EUR\",\n    \"currencySymbol\": \"€\",\n    \"source\": [\n      {\n        \"name\": \"Germany revenue\",\n        \"url\": \"https://www.germany-tax.ge\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"income\",\n      \"label\": \"ANNUAL_GROSS_INCOME\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"EUR\",\n      \"isCurrency\": true\n    }\n  ],\n  \"outputs\": [ ],\n  \"rules\": {\n  \"taxBrackets\": [\n    { \"from\": 0, \"to\": 11604, \"rate\": 0 },\n    { \"from\": 11604, \"to\": 17006, \"rate\": 0.14 },\n    { \"from\": 17006, \"to\": 62810, \"rate\": 0.24 },\n    { \"from\": 62810, \"to\": 277826, \"rate\": 0.42 },\n    { \"from\": 277826, \"to\": null, \"rate\": 0.45 }\n  ],\n  \"solidaritySurcharge\": {\n    \"rate\": 0.055,\n    \"exemptionThreshold\": 18130\n  },\n  \"socialContributions\": {\n    \"rate\": 0.197\n  }\n}\n}', 0, '2025', '', NULL),
('585d7af9-b63b-4a0f-a855-808482d46b8c', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', '103e8f49-f86a-4312-8cb9-511f872e5d84', '{\n  \"meta\": {\n    \"id\": \"ukCorporateTax\",\n    \"country\": \"GB\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CORPORATE_TAX\",\n    \"version\": \"2024.1\",\n    \"effectiveFrom\": \"2024-04-01\",\n    \"effectiveTo\": null,\n    \"currency\": \"GBP\",\n    \"currencySymbol\": \"£\",\n    \"source\": [\n      {\n        \"name\": \"HM Revenue & Customs (HMRC)\",\n        \"url\": \"https://www.gov.uk/government/organisations/hm-revenue-customs\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"taxableIncome\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"GBP\",\n      \"label\": \"TAXABLE_INCOME\"\n    },\n    {\n      \"name\": \"isSmallBusiness\",\n      \"type\": \"boolean\",\n      \"required\": true,\n      \"label\": \"IS_SMALL_BUSINESS\"\n    }\n  ],\n  \"outputs\": [\n    {\n      \"id\": \"corporateTax\",\n      \"label\": \"Corporation tax due\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"effectiveTaxRate\",\n      \"label\": \"Effective tax rate\",\n      \"type\": \"number\",\n      \"unit\": \"percent\"\n    },\n    {\n      \"id\": \"breakdowns\",\n      \"label\": \"Tax breakdown lines\",\n      \"type\": \"array\",\n      \"items\": {\n        \"type\": \"object\",\n        \"properties\": {\n          \"label\": { \"type\": \"string\" },\n          \"rate\": { \"type\": \"number\" },\n          \"amount\": { \"type\": \"money\", \"currency\": \"GBP\" }\n        }\n      }\n    }\n  ],\n  \"rules\": {\n  \"regimes\": {\n    \"smallProfits\": {\n      \"type\": \"flat\",\n      \"rate\": 0.19\n    },\n    \"main\": {\n      \"type\": \"flat\",\n      \"rate\": 0.25\n    },\n    \"marginalRelief\": {\n      \"type\": \"marginal_relief\",\n      \"mainRate\": 0.25,\n      \"smallProfitsRate\": 0.19,\n      \"upperLimit\": 250000,\n      \"lowerLimit\": 50000,\n      \"standardFraction\": 0.015\n    }\n  }\n},\n    \"breakdowns\": {\n      \"smallOrMain\": \"Single line breakdown with applied rate and amount\",\n      \"marginalRelief\": [\n        \"Line 1: grossTax at mainRate\",\n        \"Line 2: relief as negative amount (or separate relief line) so that sum(lines) == corporateTax\"\n      ]\n    },\n    \"aggregates\": {\n      \"effectiveTaxRate\": \"If taxableIncome == 0 => 0 else (corporateTax / taxableIncome) * 100\"\n    }\n}', 0, '2025', '', NULL),
('676726e5-bd58-4e37-800d-14bc6550d96a', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', '5a7422ce-aed0-4f33-b51b-465e852ed9e2', '{\n  \"meta\": {\n    \"id\": \"geInheritanceTax\",\n    \"country\": \"GE\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INHERITANCE_TAX\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"EUR\",\n    \"currencySymbol\": \"€\",\n    \"source\": [\n      {\n        \"name\": \"HM Revenue & Customs (HMRC)\",\n        \"url\": \"https://www.gov.uk/government/organisations/hm-revenue-customs\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"estateValue\",\n      \"label\": \"ESTATE_VALUE\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"EUR\",\n      \"isCurrency\": true\n    },\n    {\n        \"name\": \"taxClass\",\n        \"label\": \"TAX_CLASS\",\n        \"type\": \"select\",\n        \"required\": false,\n        \"default\": \"I\",\n        \"options\": [\n          { \"label\": \"CLASS_I\", \"value\": \"I\" },\n          { \"label\": \"CLASS_II\", \"value\": \"II\" },\n          { \"label\": \"CLASS_III\", \"value\": \"III\" }\n        ]\n    }\n  ],\n  \"outputs\": [],\n  \"rules\": {\n  \"taxClasses\": {\n    \"I\": {\n      \"exemption\": 500000,\n      \"brackets\": [\n        { \"from\": 0, \"to\": 75000, \"rate\": 0.07 },\n        { \"from\": 75000, \"to\": 300000, \"rate\": 0.11 },\n        { \"from\": 300000, \"to\": 600000, \"rate\": 0.15 },\n        { \"from\": 600000, \"to\": 6000000, \"rate\": 0.19 },\n        { \"from\": 6000000, \"to\": 13000000, \"rate\": 0.23 },\n        { \"from\": 13000000, \"to\": 26000000, \"rate\": 0.27 },\n        { \"from\": 26000000, \"to\": null, \"rate\": 0.3 }\n      ]\n    },\n    \"II\": {\n      \"exemption\": 20000,\n      \"brackets\": [\n        { \"from\": 0, \"to\": 75000, \"rate\": 0.15 },\n        { \"from\": 75000, \"to\": 300000, \"rate\": 0.2 },\n        { \"from\": 300000, \"to\": 600000, \"rate\": 0.25 },\n        { \"from\": 600000, \"to\": 6000000, \"rate\": 0.3 },\n        { \"from\": 6000000, \"to\": 13000000, \"rate\": 0.35 },\n        { \"from\": 13000000, \"to\": 26000000, \"rate\": 0.4 },\n        { \"from\": 26000000, \"to\": null, \"rate\": 0.43 }\n      ]\n    },\n    \"III\": {\n      \"exemption\": 20000,\n      \"brackets\": [\n        { \"from\": 0, \"to\": 75000, \"rate\": 0.3 },\n        { \"from\": 75000, \"to\": 300000, \"rate\": 0.3 },\n        { \"from\": 300000, \"to\": 600000, \"rate\": 0.3 },\n        { \"from\": 600000, \"to\": 6000000, \"rate\": 0.3 },\n        { \"from\": 6000000, \"to\": 13000000, \"rate\": 0.5 },\n        { \"from\": 13000000, \"to\": 26000000, \"rate\": 0.5 },\n        { \"from\": 26000000, \"to\": null, \"rate\": 0.5 }\n      ]\n    }\n  }\n}\n}', 0, '2025', '', NULL),
('683b4c9e-1da2-499a-9cf3-3996a67c2d7f', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', 'f28b71e8-12dd-4e6c-a56c-9cabafb4efcf', '{\r\n  \"meta\": {\r\n    \"id\": \"za-corporate-income-tax\",\r\n    \"country\": \"ZA\",\r\n    \"region\": \"NATIONAL\",\r\n    \"calculator\": \"CORPORATE_TAX\",\r\n    \"version\": \"2024.1\",\r\n    \"effective_from\": \"2023-04-01\",\r\n    \"effective_to\": null,\r\n    \"source\": [\r\n      {\r\n        \"name\": \"South African Revenue Service (SARS)\",\r\n        \"url\": \"https://www.sars.gov.za\"\r\n      }\r\n    ]\r\n  },\r\n  \"inputs\": [\r\n    {\r\n      \"name\": \"taxableIncome\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"unit\": \"ZAR\",\r\n      \"isCurrency\": true,\r\n      \"label\": \"TAXABLE_INCOME\"\r\n    },\r\n    {\r\n      \"name\": \"grossIncome\",\r\n      \"type\": \"number\",\r\n      \"required\": false,\r\n      \"unit\": \"ZAR\",\r\n      \"description\": \"Required only for SBC eligibility checks\",\r\n      \"label\": \"GROSS_INCOME\",\r\n      \"isCurrency\": true\r\n    },\r\n    {\r\n      \"name\": \"isSmallBusiness\",\r\n      \"type\": \"boolean\",\r\n      \"required\": true,\r\n      \"label\": \"IS_SMALL_BUSINESS\"\r\n    }\r\n  ],\r\n  \"outputs\": [\r\n    {\r\n      \"name\": \"corporateTax\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"ZAR\"\r\n    },\r\n    {\r\n      \"name\": \"effectiveTaxRate\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"PERCENT\"\r\n    }\r\n  ],\r\n  \"rules\": {\r\n    \"regimes\": {\r\n      \"LARGE\": {\r\n        \"type\": \"flat\",\r\n        \"rate\": 0.27\r\n      },\r\n      \"SBC\": {\r\n        \"type\": \"progressive\",\r\n        \"eligibility\": {\r\n          \"maxGrossIncome\": 20000000,\r\n          \"shareholders\": \"NATURAL_PERSONS_ONLY\",\r\n          \"resident\": true\r\n        },\r\n        \"brackets\": [\r\n          { \"from\": 0, \"to\": 95750, \"rate\": 0.0 },\r\n          { \"from\": 95751, \"to\": 365000, \"rate\": 0.07 },\r\n          { \"from\": 365001, \"to\": 550000, \"rate\": 0.21 },\r\n          { \"from\": 550001, \"to\": null, \"rate\": 0.27 }\r\n        ]\r\n      }\r\n    }\r\n  }\r\n}', 0, '2025', '', NULL),
('699292ce-3ed3-4081-8b7e-f117ad843614', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', '0328a50e-d83b-45a6-a963-d19983e83763', '{\"meta\":{\"id\":\"brazilMortgage\",\"country\":\"BR\",\"region\":\"NATIONAL\",\"calculator\":\"MORTGAGE\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"BRL\",\"currencySymbol\":\"R$\",\"source\":[{\"name\":\"Banco Central do Brasil\",\"url\":\"https://www.bcb.gov.br\"}]},\"inputs\":[{\"type\":\"number\",\"min\":1,\"isCurrency\":true,\"label\":\"PROPERTY_PRICE\",\"name\":\"propertyPrice\"},{\"type\":\"number\",\"min\":0,\"isCurrency\":true,\"label\":\"DOWN_PAYMENT\",\"slider\":{\"max\":50,\"min\":0,\"step\":1},\"name\":\"downPayment\"},{\"type\":\"number\",\"min\":0,\"label\":\"INTEREST_RATE\",\"slider\":{\"max\":15,\"min\":0.5,\"step\":0.1},\"name\":\"interestRate\"},{\"type\":\"number\",\"min\":1,\"label\":\"LOAN_DURATION\",\"name\":\"amortizationYears\"},{\"type\":\"boolean\",\"label\":\"IS_FIRST_TIME_BUYER\",\"name\":\"isFirstTimeBuyer\"}],\"outputs\":[],\"rules\":{\"loanConstraints\":{\"maxLtvPercent\":80,\"maxAmortizationYears\":35},\"interest\":{\"compounding\":\"MONTHLY\"},\"itbi\":{\"rate\":0.03}}}', 0, '2025', '', NULL),
('6a971d95-03e8-4e06-8377-1d21d4bfc124', 'de10134b-ffab-4835-b608-592934b4331e', 'cdadfc67-5dff-49f3-9b11-a601cc374938', '{\n  \"meta\": {\n    \"id\": \"au-capital-gains\",\n    \"country\": \"AU\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CAPITAL_GAINS\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-01-01\",\n    \"effectiveTo\": null,\n    \"source\": [\n      { \"name\": \"Australian Taxation Office (ATO)\", \"url\": \"https://www.ato.gov.au\" }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"capitalGain\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"AUD\",\n      \"isCurrency\": true,\n      \"label\": \"CAPITAL_GAIN\"\n    },\n    {\n      \"name\": \"totalTaxableIncome\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"AUD\",\n      \"isCurrency\": true,\n      \"label\": \"TOTAL_TAXABLE_INCOME\"\n    },\n    {\n      \"name\": \"holdingPeriodMonths\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"MONTH\",\n      \"label\": \"HOLDING_PERIOD_MONTHS\"\n    }\n  ],\n  \"outputs\": [\n    { \"name\": \"discountedCapitalGain\", \"type\": \"number\", \"unit\": \"AUD\" },\n    { \"name\": \"capitalGainsTax\", \"type\": \"number\", \"unit\": \"AUD\" },\n    { \"name\": \"effectiveRate\", \"type\": \"number\", \"unit\": \"PERCENT\" }\n  ],\n  \"rules\": {\n  \"cgtDiscount\": 0.5,\n  \"cgtDiscountMinMonths\": 12,\n  \"taxBrackets\": [\n    { \"from\": 0, \"to\": 18200, \"rate\": 0 },\n    { \"from\": 18200, \"to\": 45000, \"rate\": 0.16 },\n    { \"from\": 45000, \"to\": 135000, \"rate\": 0.3 },\n    { \"from\": 135000, \"to\": 190000, \"rate\": 0.37 },\n    { \"from\": 190000, \"to\": null, \"rate\": 0.45 }\n  ]\n}\n}', 0, '2025', '', NULL),
('6e7d24af-cce9-4b4a-82ee-af104bb9fb35', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', 'a4a3389e-785a-455a-aa7f-c9eb05a9a7e4', '{\r\n  \"meta\": {\r\n    \"id\": \"fr-federal-corporate\",\r\n    \"calculator\": \"corporateIncomeTax\",\r\n    \"level\": \"country\",\r\n    \"currency\": \"eur\",\r\n    \"version\": \"2025.1\"\r\n  },\r\n  \"inputs\": [\r\n    {\r\n      \"name\": \"taxableIncome\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"isCurrency\": true,\r\n      \"label\": \"TAXABLE_INCOME\"\r\n    },\r\n    {\r\n      \"name\": \"annualTurnover\",\r\n      \"type\": \"number\",\r\n      \"required\": false,\r\n      \"isCurrency\": true,\r\n      \"label\": \"ANNUAL_TURNOVER\"\r\n    },\r\n    {\r\n      \"name\": \"isSmallBusiness\",\r\n      \"type\": \"boolean\",\r\n      \"required\": true,\r\n      \"label\": \"IS_SMALL_BUSINESS\"\r\n    }\r\n  ],\r\n  \"outputs\": [\r\n    {\r\n      \"name\": \"corporateTax\",\r\n      \"type\": \"number\",\r\n      \"unit\": \"eur\"\r\n    }\r\n  ],\r\n  \"rules\": {\r\n    \"regimes\": {\r\n      \"general\": {\r\n        \"type\": \"flat\",\r\n        \"rate\": 0.25\r\n      },\r\n      \"smallBusiness\": {\r\n        \"type\": \"progressive\",\r\n        \"conditions\": {\r\n          \"maxTurnover\": 10000000\r\n        },\r\n        \"brackets\": [\r\n          {\r\n            \"from\": 0,\r\n            \"to\": 42500,\r\n            \"rate\": 0.15\r\n          },\r\n          {\r\n            \"from\": 42500,\r\n            \"to\": null,\r\n            \"rate\": 0.25\r\n          }\r\n        ]\r\n      }\r\n    }\r\n  }\r\n}', 0, '2025', '', NULL),
('787c4932-ecc4-46d7-9d7e-97c82c8bcaf1', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', '103e8f49-f86a-4312-8cb9-511f872e5d84', '{\n  \"meta\": {\n    \"id\": \"ukIncomeTax\",\n    \"country\": \"GB\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INCOME_TAX\",\n    \"version\": \"2024.1\",\n    \"effectiveFrom\": \"2024-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"GBP\",\n    \"currencySymbol\": \"£\",\n    \"source\": [\n      {\n        \"name\": \"HM Revenue & Customs (HMRC)\",\n        \"url\": \"https://www.gov.uk/government/organisations/hm-revenue-customs\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"income\",\n      \"label\": \"ANNUAL_GROSS_INCOME\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"GBP\",\n      \"isCurrency\": true\n    }\n  ],\n  \"outputs\": [\n    {\n      \"id\": \"grossIncome\",\n      \"label\": \"Gross income\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"personalAllowance\",\n      \"label\": \"Personal allowance applied\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"taxableIncome\",\n      \"label\": \"Taxable income (after personal allowance)\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"incomeTax\",\n      \"label\": \"Income tax\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"nationalInsurance\",\n      \"label\": \"National Insurance (employee)\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"totalDeductions\",\n      \"label\": \"Total deductions\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"netIncome\",\n      \"label\": \"Net income\",\n      \"type\": \"money\",\n      \"currency\": \"GBP\"\n    },\n    {\n      \"id\": \"effectiveTaxRate\",\n      \"label\": \"Effective tax rate (incomeTax / grossIncome)\",\n      \"type\": \"number\",\n      \"unit\": \"ratio\"\n    }\n  ],\n  \"rules\": {\n    \"taxBrackets\": [\n    { \"from\": 0, \"to\": 37700, \"rate\": 0.2 },\n    { \"from\": 37700, \"to\": 125140, \"rate\": 0.4 },\n    { \"from\": 125140, \"to\": null, \"rate\": 0.45 }\n  ],\n  \"personalAllowance\": {\n    \"amount\": 12570,\n    \"taperThreshold\": 100000,\n    \"taperRate\": 0.5\n  },\n  \"nationalInsurance\": {\n    \"primaryThreshold\": 12570,\n    \"upperEarningsLimit\": 50270,\n    \"mainRate\": 0.08,\n    \"upperRate\": 0.02\n  },\n    \"aggregates\": {\n      \"totalDeductions\": \"incomeTax + nationalInsurance\",\n      \"netIncome\": \"grossIncome - totalDeductions\",\n      \"effectiveTaxRate\": \"incomeTax / grossIncome\"\n    }\n  }\n}', 0, '2025', '', NULL),
('7f4fe58e-fa3d-4acb-97e7-fa069802a18a', 'de10134b-ffab-4835-b608-592934b4331e', 'a4a3389e-785a-455a-aa7f-c9eb05a9a7e4', '{\n  \"meta\": {\n    \"id\": \"fr-capital-gains\",\n    \"country\": \"FR\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CAPITAL_GAINS\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-01-01\",\n    \"effectiveTo\": null,\n    \"source\": [\n      { \"name\": \"impots.gouv.fr\", \"url\": \"https://www.impots.gouv.fr\" }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"capitalGain\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"EUR\",\n      \"isCurrency\": true,\n      \"label\": \"CAPITAL_GAIN\"\n    }\n  ],\n  \"outputs\": [\n    { \"name\": \"incomeTaxPortion\", \"type\": \"number\", \"unit\": \"EUR\" },\n    { \"name\": \"socialContributionsPortion\", \"type\": \"number\", \"unit\": \"EUR\" },\n    { \"name\": \"capitalGainsTax\", \"type\": \"number\", \"unit\": \"EUR\" },\n    { \"name\": \"effectiveRate\", \"type\": \"number\", \"unit\": \"PERCENT\" }\n  ],\n  \"rules\": {\n    \"flatTaxRate\": 0.128,\n    \"socialContributionsRate\": 0.172\n  }\n}', 0, '2025', '', NULL),
('80c73380-562b-4183-8809-d410cc5968b6', 'de10134b-ffab-4835-b608-592934b4331e', 'f28b71e8-12dd-4e6c-a56c-9cabafb4efcf', '{\n  \"meta\": {\n    \"id\": \"za-capital-gains\",\n    \"country\": \"ZA\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CAPITAL_GAINS\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-01-01\",\n    \"effectiveTo\": null,\n    \"source\": [\n      { \"name\": \"South African Revenue Service (SARS)\", \"url\": \"https://www.sars.gov.za\" }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"capitalGain\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"ZAR\",\n      \"isCurrency\": true,\n      \"label\": \"CAPITAL_GAIN\"\n    },\n    {\n      \"name\": \"totalTaxableIncome\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"ZAR\",\n      \"isCurrency\": true,\n      \"label\": \"TOTAL_TAXABLE_INCOME\"\n    }\n  ],\n  \"outputs\": [\n    { \"name\": \"taxableCapitalGain\", \"type\": \"number\", \"unit\": \"ZAR\" },\n    { \"name\": \"capitalGainsTax\", \"type\": \"number\", \"unit\": \"ZAR\" },\n    { \"name\": \"effectiveRate\", \"type\": \"number\", \"unit\": \"PERCENT\" }\n  ],\n  \"rules\": {\n  \"inclusionRate\": 0.4,\n  \"annualExclusion\": 40000,\n  \"taxBrackets\": [\n    { \"from\": 0, \"to\": 237100, \"rate\": 0.18 },\n    { \"from\": 237100, \"to\": 370500, \"rate\": 0.26 },\n    { \"from\": 370500, \"to\": 512800, \"rate\": 0.31 },\n    { \"from\": 512800, \"to\": 673000, \"rate\": 0.36 },\n    { \"from\": 673000, \"to\": 857900, \"rate\": 0.39 },\n    { \"from\": 857900, \"to\": 1817000, \"rate\": 0.41 },\n    { \"from\": 1817000, \"to\": null, \"rate\": 0.45 }\n  ]\n}\n}', 0, '2025', '', NULL),
('91d82e55-f8b2-4dbe-877e-05b63241fc54', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', '0328a50e-d83b-45a6-a963-d19983e83763', '{\"meta\":{\"id\":\"brazilCorporateTax\",\"country\":\"BR\",\"region\":\"NATIONAL\",\"calculator\":\"CORPORATE_TAX\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"BRL\",\"currencySymbol\":\"R$\",\"source\":[{\"name\":\"Receita Federal do Brasil\",\"url\":\"https://www.gov.br/receitafederal\"}]},\"inputs\":[{\"name\":\"taxableIncome\",\"type\":\"number\",\"required\":true,\"unit\":\"BRL\",\"isCurrency\":true,\"label\":\"TAXABLE_INCOME\"}],\"outputs\":[],\"rules\":{\"irpj\":{\"baseRate\":0.15,\"surchargeRate\":0.10,\"surchargeThreshold\":240000},\"csll\":{\"rate\":0.09}}}', 0, '2025', '', NULL),
('9550a9c3-28b6-4676-862f-95e3223e9088', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '{\r\n    \"meta\": {\r\n        \"id\": \"canada-federal-income-tax\",\r\n        \"country\": \"CA\",\r\n        \"region\": \"FEDERAL\",\r\n        \"calculator\": \"INCOME_TAX\",\r\n        \"version\": \"2025.1\",\r\n        \"effectiveFrom\": \"2025-01-01\",\r\n        \"effectiveTo\": null,\r\n        \"currency\": \"CAD\",\r\n        \"currencySymbol\": \"$\",\r\n        \"source\": [\r\n            {\r\n                \"name\": \"Canada Revenue Agency\",\r\n                \"url\": \"https://www.canada.ca/en/revenue-agency.html\"\r\n            }\r\n        ]\r\n    },\r\n\r\n    \"inputs\": [\r\n        {\r\n            \"name\": \"income\",\r\n            \"type\": \"number\",\r\n            \"required\": true,\r\n            \"unit\": \"CAD\",\r\n            \"isCurrency\": true,\r\n            \"label\": \"ANNUAL_GROSS_INCOME\"\r\n        }\r\n    ],\r\n\r\n    \"outputs\": [\r\n        {\r\n            \"name\": \"federalTax\",\r\n            \"type\": \"number\",\r\n            \"unit\": \"CAD\"\r\n        },\r\n        {\r\n            \"name\": \"netIncome\",\r\n            \"type\": \"number\",\r\n            \"unit\": \"CAD\"\r\n        }\r\n    ],\r\n\r\n    \"rules\": {\r\n        \"taxBrackets\": [\r\n            {\r\n                \"from\": 0,\r\n                \"to\": 53359,\r\n                \"rate\": 0.15\r\n            },\r\n            {\r\n                \"from\": 53359,\r\n                \"to\": 106717,\r\n                \"rate\": 0.205\r\n            },\r\n            {\r\n                \"from\": 106717,\r\n                \"to\": 165430,\r\n                \"rate\": 0.26\r\n            },\r\n            {\r\n                \"from\": 165430,\r\n                \"to\": null,\r\n                \"rate\": 0.29\r\n            }\r\n        ],\r\n        \"credits\": {\r\n            \"basicPersonalAmount\": {\r\n                \"amount\": 15000,\r\n                \"type\": \"nonRefundable\",\r\n                \"rate\": 0.15\r\n            }\r\n        },\r\n        \"contributions\": {\r\n            \"cpp\": {\r\n                \"rate\": 0.0595,\r\n                \"maxContribution\": 3754.45,\r\n                \"exemption\": 3500\r\n            },\r\n            \"ei\": {\r\n                \"rate\": 0.0166,\r\n                \"maxInsurableEarnings\": 63200,\r\n                \"maxContribution\": 1049.12\r\n            }\r\n        }\r\n    }\r\n}\r\n', 1, '2025', '', NULL),
('9a3d8e25-1a99-4b91-ab58-0e0420210933', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b', '{\"meta\":{\"id\":\"jpInheritanceTax\",\"country\":\"JP\",\"region\":\"NATIONAL\",\"calculator\":\"INHERITANCE_TAX\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"JPY\",\"currencySymbol\":\"¥\",\"source\":[{\"name\":\"National Tax Agency Japan\",\"url\":\"https://www.nta.go.jp\"}]},\"inputs\":[{\"name\":\"estateValue\",\"label\":\"ESTATE_VALUE\",\"type\":\"number\",\"required\":true,\"unit\":\"JPY\",\"isCurrency\":true},{\"name\":\"numberOfStatutoryHeirs\",\"label\":\"NUMBER_OF_HEIRS\",\"type\":\"number\",\"required\":false,\"default\":1}],\"outputs\":[],\"rules\":{\"baseExemption\":30000000,\"perHeirExemption\":6000000,\"taxBrackets\":[{\"from\":0,\"to\":10000000,\"rate\":0.10},{\"from\":10000000,\"to\":30000000,\"rate\":0.15},{\"from\":30000000,\"to\":50000000,\"rate\":0.20},{\"from\":50000000,\"to\":100000000,\"rate\":0.30},{\"from\":100000000,\"to\":200000000,\"rate\":0.40},{\"from\":200000000,\"to\":300000000,\"rate\":0.45},{\"from\":300000000,\"to\":600000000,\"rate\":0.50},{\"from\":600000000,\"to\":null,\"rate\":0.55}]}}', 0, '2025', '', NULL),
('9c9e1651-c275-439d-bbb1-29eb54675922', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '{\r\n  \"meta\": {\r\n    \"id\": \"ca-federal-corporate\",\r\n    \"calculator\": \"corporateIncomeTax\",\r\n    \"level\": \"federal\",\r\n    \"currency\": \"cad\",\r\n    \"version\": \"2025.1\"\r\n  },\r\n  \"inputs\": [\r\n    {\r\n      \"name\": \"taxableIncome\",\r\n      \"type\": \"number\",\r\n      \"required\": true,\r\n      \"isCurrency\": true,\r\n      \"label\": \"TAXABLE_INCOME\"\r\n    },\r\n    {\r\n      \"name\": \"isSmallBusiness\",\r\n      \"type\": \"boolean\",\r\n      \"required\": true,\r\n      \"label\": \"IS_SMALL_BUSINESS\"\r\n    }\r\n  ],\r\n  \"outputs\": [\r\n    {\r\n      \"name\": \"federalTax\",\r\n      \"type\": \"number\"\r\n    }\r\n  ],\r\n  \"rules\": {\r\n    \"regimes\": {\r\n      \"general\": {\r\n        \"type\": \"flat\",\r\n        \"rate\": 0.15\r\n      },\r\n      \"smallBusiness\": {\r\n        \"type\": \"progressive\",\r\n        \"brackets\": [\r\n          {\r\n            \"from\": 0,\r\n            \"to\": 500000,\r\n            \"rate\": 0.09\r\n          },\r\n          {\r\n            \"from\": 500000,\r\n            \"to\": null,\r\n            \"rate\": 0.15\r\n          }\r\n        ]\r\n      }\r\n    }\r\n  }\r\n}\r\n', 1, '2025', '', NULL);
INSERT INTO `calculator_countries` (`ID`, `CalculatorTypeID`, `CountryID`, `JsonSchema`, `WithProvincial`, `Year`, `CreatedAt`, `DisabledAt`) VALUES
('a23c15c9-46d3-4872-8379-e82ceb223d8f', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', 'f28b71e8-12dd-4e6c-a56c-9cabafb4efcf', '{\r\n  \"meta\": {\r\n    \"id\": \"za-mortgage-2025\",\r\n    \"country\": \"southAfrica\",\r\n    \"region\": \"FEDERAL\",\r\n    \"calculator\": \"MORTGAGE\",\r\n    \"version\": \"2025.1\",\r\n    \"effectiveFrom\": \"2025-01-01\",\r\n    \"currency\": \"ZAR\",\r\n    \"currencySymbol\": \"R\",\r\n    \"source\": [\r\n      {\r\n        \"name\": \"South African Banks – Standard Mortgage Guidelines\",\r\n        \"url\": \"https://www.resbank.co.za\"\r\n      }\r\n    ]\r\n  },\r\n\r\n  \"inputs\": [\r\n    {\r\n      \"type\": \"number\",\r\n      \"min\": 1,\r\n      \"isCurrency\": true,\r\n      \"label\": \"PROPERTY_PRICE\",\r\n      \"name\": \"propertyPrice\"\r\n    },\r\n    {\r\n       \"type\": \"number\",\r\n       \"min\": 0,\r\n       \"isCurrency\": true,\r\n       \"label\": \"DOWN_PAYMENT\",\r\n       \"slider\": { \"max\": 50, \"min\": 0, \"step\": 1 },\r\n       \"name\": \"downPayment\"\r\n    },\r\n    {\r\n      \"type\": \"number\",\r\n      \"min\": 0,\r\n      \"label\": \"INTEREST_RATE\",\r\n      \"slider\": { \"max\": 15, \"min\": 0.5, \"step\": 0.1 },\r\n      \"name\": \"interestRate\"\r\n    },\r\n    {\r\n      \"type\": \"number\",\r\n      \"min\": 1,\r\n      \"label\": \"LOAN_DURATION\",\r\n      \"name\": \"amortizationYears\"\r\n    },\r\n    {\r\n      \"type\": \"number\",\r\n      \"min\": 1,\r\n      \"isCurrency\": true,\r\n      \"label\": \"MONTHLY_GROSS_INCOME\",\r\n      \"name\": \"grossMonthlyIncome\"\r\n    }\r\n  ],\r\n\r\n  \"rules\": {\r\n    \"loanConstraints\": {\r\n      \"maxLtv\": 1.0,\r\n      \"minDownPaymentPercent\": 0,\r\n      \"maxAmortizationYears\": 25,\r\n      \"maxDebtToIncomePercent\": 30\r\n    },\r\n\r\n    \"interest\": {\r\n      \"type\": \"variable\",\r\n      \"rateRangePercent\": { \"min\": 9.5, \"max\": 14.5 },\r\n      \"stressTestBufferPercent\": 2\r\n    },\r\n\r\n    \"insurance\": {\r\n      \"required\": false\r\n    },\r\n\r\n    \"fees\": {\r\n      \"bondRegistrationPercent\": 2.0,\r\n      \"transferDuty\": {\r\n        \"brackets\": [\r\n          { \"upTo\": 1100000, \"rate\": 0 },\r\n          { \"upTo\": 1512500, \"rate\": 0.03 },\r\n          { \"upTo\": 2117500, \"rate\": 0.06 },\r\n          { \"upTo\": 2962500, \"rate\": 0.08 },\r\n          { \"upTo\": 4162500, \"rate\": 0.11 },\r\n          { \"above\": 4162500, \"rate\": 0.13 }\r\n        ]\r\n      }\r\n    }\r\n  },\r\n\r\n  \"outputs\": {\r\n    \"loanAmount\": \"number\",\r\n    \"monthlyPayment\": \"number\",\r\n    \"totalInterestPaid\": \"number\",\r\n    \"totalPaid\": \"number\",\r\n    \"debtToIncomeRatio\": \"number\",\r\n    \"isAffordable\": \"boolean\",\r\n    \"transferDuty\": \"number\",\r\n    \"bondRegistrationFee\": \"number\"\r\n  }\r\n}\r\n', 0, '2025', '', NULL),
('a545f033-a30d-495b-856b-299a6fbc9508', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', '87dfdcf2-2f85-42c0-8eac-82957d98fd08', '{\n  \"meta\": {\n    \"id\": \"usaInheritanceTax\",\n    \"country\": \"US\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INHERITANCE_TAX\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"USD\",\n    \"currencySymbol\": \"$\",\n    \"source\": [\n      {\n        \"name\": \"Internal Revenue Service (IRS)\",\n        \"url\": \"https://www.irs.gov/\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"estateValue\",\n      \"label\": \"ESTATE_VALUE\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"USD\",\n      \"isCurrency\": true\n    }\n  ],\n  \"outputs\": [],\n  \"rules\": {\n    \"exemption\": 13610000,\n    \"taxBrackets\": [\n        { \"from\": 0, \"to\": 10000, \"rate\": 0.18 },\n        { \"from\": 10000, \"to\": 20000, \"rate\": 0.20 },\n        { \"from\": 20000, \"to\": 40000, \"rate\": 0.22 },\n        { \"from\": 40000, \"to\": 60000, \"rate\": 0.24 },\n        { \"from\": 60000, \"to\": 80000, \"rate\": 0.26 },\n        { \"from\": 80000, \"to\": 100000, \"rate\": 0.28 },\n        { \"from\": 100000, \"to\": 150000, \"rate\": 0.30 },\n        { \"from\": 150000, \"to\": 250000, \"rate\": 0.32 },\n        { \"from\": 250000, \"to\": 500000, \"rate\": 0.34 },\n        { \"from\": 500000, \"to\": 750000, \"rate\": 0.36 },\n        { \"from\": 750000, \"to\": 1000000, \"rate\": 0.38 },\n        { \"from\": 1000000, \"to\": null, \"rate\": 0.40 }\n    ]\n}\n}', 0, '2025', '', NULL),
('a89e4bb7-5c7f-4255-91cb-d7950ea7f2e2', 'de10134b-ffab-4835-b608-592934b4331e', '87dfdcf2-2f85-42c0-8eac-82957d98fd08', '{\n  \"meta\": {\n    \"id\": \"usa-capital-gains\",\n    \"country\": \"USA\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CAPITAL_GAINS\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-01-01\",\n    \"effectiveTo\": null,\n    \"source\": [\n      { \"name\": \"Internal Revenue Service (IRS)\", \"url\": \"https://www.irs.gov\" }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"capitalGain\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"USD\",\n      \"isCurrency\": true,\n      \"label\": \"CAPITAL_GAIN\"\n    },\n    {\n      \"name\": \"totalTaxableIncome\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"USD\",\n      \"isCurrency\": true,\n      \"label\": \"TOTAL_TAXABLE_INCOME\"\n    },\n    {\n      \"name\": \"holdingPeriodMonths\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"MONTH\",\n      \"label\": \"HOLDING_PERIOD_MONTHS\"\n    }\n  ],\n  \"outputs\": [\n    { \"name\": \"capitalGainsTax\", \"type\": \"number\", \"unit\": \"USD\" },\n    { \"name\": \"netInvestmentIncomeTax\", \"type\": \"number\", \"unit\": \"USD\" },\n    { \"name\": \"totalTax\", \"type\": \"number\", \"unit\": \"USD\" },\n    { \"name\": \"effectiveRate\", \"type\": \"number\", \"unit\": \"PERCENT\" }\n  ],\n  \"rules\":   {\n  \"longTermBrackets\": [\n    { \"from\": 0, \"to\": 47025, \"rate\": 0 },\n    { \"from\": 47025, \"to\": 518900, \"rate\": 0.15 },\n    { \"from\": 518900, \"to\": null, \"rate\": 0.2 }\n  ],\n  \"shortTermBrackets\": [\n    { \"from\": 0, \"to\": 11600, \"rate\": 0.1 },\n    { \"from\": 11600, \"to\": 47150, \"rate\": 0.12 },\n    { \"from\": 47150, \"to\": 100525, \"rate\": 0.22 },\n    { \"from\": 100525, \"to\": 191950, \"rate\": 0.24 },\n    { \"from\": 191950, \"to\": 243725, \"rate\": 0.32 },\n    { \"from\": 243725, \"to\": 609350, \"rate\": 0.35 },\n    { \"from\": 609350, \"to\": null, \"rate\": 0.37 }\n  ],\n  \"netInvestmentIncomeTax\": {\n    \"rate\": 0.038,\n    \"threshold\": 200000\n  }\n}\n}', 0, '2025', '', NULL),
('b0f5fdd9-8b49-4f71-8e47-d7ea9a4ef8e1', 'de10134b-ffab-4835-b608-592934b4331e', '0328a50e-d83b-45a6-a963-d19983e83763', '{\"meta\":{\"id\":\"br-capital-gains\",\"country\":\"BR\",\"region\":\"NATIONAL\",\"calculator\":\"CAPITAL_GAINS\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"BRL\",\"currencySymbol\":\"R$\",\"source\":[{\"name\":\"Receita Federal do Brasil\",\"url\":\"https://www.gov.br/receitafederal\"}]},\"inputs\":[{\"name\":\"capitalGain\",\"type\":\"number\",\"required\":true,\"unit\":\"BRL\",\"isCurrency\":true,\"label\":\"CAPITAL_GAIN\"}],\"outputs\":[],\"rules\":{\"brackets\":[{\"from\":0,\"to\":5000000,\"rate\":0.15},{\"from\":5000000,\"to\":10000000,\"rate\":0.175},{\"from\":10000000,\"to\":30000000,\"rate\":0.20},{\"from\":30000000,\"to\":null,\"rate\":0.225}]}}', 0, '2025', '', NULL),
('bbbebe7d-a8a2-432e-87ae-e527445ce68d', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '{\r\n  \"meta\": {\r\n    \"id\": \"ca-federal-mortgage-2025\",\r\n    \"country\": \"CA\",\r\n    \"region\": \"FEDERAL\",\r\n    \"calculator\": \"MORTGAGE\",\r\n    \"version\": \"2025.1\",\r\n    \"effectiveFrom\": \"2025-01-01\",\r\n    \"effectiveTo\": null,\r\n    \"currency\": \"CAD\",\r\n    \"currencySymbol\": \"$\",\r\n    \"source\": [\r\n      {\r\n        \"name\": \"Government of Canada – Mortgage Rules\",\r\n        \"url\": \"https://www.canada.ca/en/financial-consumer-agency/services/mortgages.html\"\r\n      }\r\n    ]\r\n  },\r\n  \"inputs\": [\r\n    {\r\n      \"type\": \"number\",\r\n      \"min\": 1,\r\n      \"isCurrency\": true,\r\n      \"label\": \"PROPERTY_PRICE\",\r\n      \"name\": \"propertyPrice\"\r\n    },\r\n    {\r\n       \"type\": \"number\",\r\n       \"min\": 0,\r\n       \"isCurrency\": true,\r\n       \"label\": \"DOWN_PAYMENT\",\r\n       \"slider\": { \"max\": 50, \"min\": 0, \"step\": 1 },\r\n       \"name\": \"downPayment\"\r\n    },\r\n    {\r\n      \"type\": \"number\",\r\n      \"min\": 0,\r\n      \"label\": \"INTEREST_RATE\",\r\n      \"slider\": { \"max\": 15, \"min\": 0.5, \"step\": 0.1 },\r\n      \"name\": \"interestRate\"\r\n    },\r\n    {\r\n      \"type\": \"number\",\r\n      \"min\": 1,\r\n      \"label\": \"LOAN_DURATION\",\r\n      \"name\": \"amortizationYears\"\r\n    },\r\n    {\r\n      \"type\": \"number\",\r\n      \"min\": 1,\r\n      \"isCurrency\": true,\r\n      \"label\": \"MONTHLY_GROSS_INCOME\",\r\n      \"name\": \"grossMonthlyIncome\"\r\n    }\r\n  ]\r\n  ,\r\n    \"rules\": {\r\n    \"loanConstraints\": {\r\n      \"maxAmortizationYears\": 30,\r\n      \"insuredMaxAmortizationYears\": 25,\r\n      \"minDownPayment\": {\r\n        \"upTo500k\": 0.05,\r\n        \"above500k\": 0.10\r\n      }\r\n    },\r\n        \"mortgageInsurance\": {\r\n      \"requiredBelowLtv\": 0.80,\r\n      \"premiumRates\": [\r\n        { \"maxLtv\": 0.80, \"rate\": 0.000 },\r\n        { \"maxLtv\": 0.85, \"rate\": 0.028 },\r\n        { \"maxLtv\": 0.90, \"rate\": 0.031 },\r\n        { \"maxLtv\": 0.95, \"rate\": 0.040 }\r\n      ],\r\n      \"premiumAddedToLoan\": true\r\n    },\r\n        \"interest\": {\r\n      \"compounding\": \"SEMI_ANNUAL\",\r\n      \"conversionFormula\": \"CANADA_STANDARD\"\r\n    },\r\n        \"paymentFrequencyRules\": {\r\n      \"MONTHLY\": { \"paymentsPerYear\": 12 },\r\n      \"BI_WEEKLY\": { \"paymentsPerYear\": 26 },\r\n      \"ACCELERATED_BI_WEEKLY\": {\r\n        \"paymentsPerYear\": 26,\r\n        \"acceleration\": true\r\n      }\r\n    },\r\n        \"stressTest\": {\r\n      \"apply\": true,\r\n      \"minimumRateBuffer\": 0.02,\r\n      \"minimumQualifyingRate\": 0.0525\r\n    }\r\n  },\r\n    \"outputs\": {\r\n    \"loanAmount\": \"number\",\r\n    \"insurancePremium\": \"number\",\r\n    \"totalMortgage\": \"number\",\r\n    \"paymentAmount\": \"number\",\r\n    \"totalInterestPaid\": \"number\",\r\n    \"totalPaid\": \"number\"\r\n  }\r\n}\r\n', 0, '2025', '', NULL),
('cdadfc67-5dff-49f3-9b11-a601cc374938', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', 'cdadfc67-5dff-49f3-9b11-a601cc374938', '{\n  \"meta\": {\n    \"id\": \"au-corporate-income-tax\",\n    \"country\": \"AU\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CORPORATE_TAX\",\n    \"version\": \"2024.1\",\n    \"effectiveFrom\": \"2024-07-01\",\n    \"effectiveTo\": null,\n    \"source\": [\n      {\n        \"name\": \"Australian Taxation Office (ATO)\",\n        \"url\": \"https://www.ato.gov.au\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"taxableIncome\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"AUD\",\n      \"isCurrency\": true,\n      \"label\": \"TAXABLE_INCOME\"\n    },\n{\n      \"name\": \"annualTurnover\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"AUD\",\n      \"isCurrency\": true,\n      \"label\": \"ANNUAL_TURNOVER\"\n    },\n\n    {\n      \"name\": \"isSmallBusiness\",\n      \"type\": \"boolean\",\n      \"required\": true,\n      \"label\": \"IS_BASE_RATE_ENTITY\"\n    }\n  ],\n  \"outputs\": [\n    {\n      \"name\": \"corporateTax\",\n      \"type\": \"number\",\n      \"unit\": \"AUD\"\n    },\n    {\n      \"name\": \"effectiveTaxRate\",\n      \"type\": \"number\",\n      \"unit\": \"PERCENT\"\n    }\n  ],\n  \"rules\": {\n    \"regimes\": {\n      \"smallBusiness\": {\n        \"type\": \"flat\",\n        \"rate\": 0.25,\n        \"conditions\": {\n          \"maxTurnover\": 50000000\n        }\n      },\n      \"general\": {\n        \"type\": \"flat\",\n        \"rate\": 0.3\n      }\n    },\n    \"regimeSelection\": {\n      \"whenIsBaseRateEntityTrue\": \"BASE_RATE_ENTITY\",\n      \"otherwise\": \"STANDARD\"\n    }\n  }\n}', 0, '2025', '', NULL),
('dab21abf-6876-4d18-84de-c7df52dd2d49', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', '0328a50e-d83b-45a6-a963-d19983e83763', '{\"meta\":{\"id\":\"brazilIncomeTax\",\"country\":\"BR\",\"region\":\"NATIONAL\",\"calculator\":\"INCOME_TAX\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"BRL\",\"currencySymbol\":\"R$\",\"source\":[{\"name\":\"Receita Federal do Brasil\",\"url\":\"https://www.gov.br/receitafederal\"}]},\"inputs\":[{\"name\":\"income\",\"label\":\"ANNUAL_GROSS_INCOME\",\"type\":\"number\",\"required\":true,\"unit\":\"BRL\",\"isCurrency\":true}],\"outputs\":[],\"rules\":{\"taxBrackets\":[{\"from\":0,\"to\":26963.20,\"rate\":0},{\"from\":26963.20,\"to\":33919.80,\"rate\":0.075},{\"from\":33919.80,\"to\":45012.60,\"rate\":0.15},{\"from\":45012.60,\"to\":55976.16,\"rate\":0.225},{\"from\":55976.16,\"to\":null,\"rate\":0.275}],\"inss\":{\"rate\":0.14,\"cap\":8786.56}}}', 0, '2025', '', NULL),
('dbb57deb-e9ee-4739-87c6-6b56319c3f92', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', '08891a23-c70c-4fc3-a7d4-47ec69d3ea13', '{\"meta\":{\"id\":\"indiaCorporateTax\",\"country\":\"IN\",\"region\":\"NATIONAL\",\"calculator\":\"CORPORATE_TAX\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-04-01\",\"effectiveTo\":null,\"currency\":\"INR\",\"currencySymbol\":\"₹\",\"source\":[{\"name\":\"Income Tax Department India\",\"url\":\"https://www.incometax.gov.in\"}]},\"inputs\":[{\"name\":\"taxableIncome\",\"type\":\"number\",\"required\":true,\"unit\":\"INR\",\"isCurrency\":true,\"label\":\"TAXABLE_INCOME\"}],\"outputs\":[],\"rules\":{\"regime\":{\"type\":\"flat\",\"rate\":0.2542}}}', 0, '2025', '', NULL),
('dd384352-33b5-4f8f-9367-b53d51107b1c', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', '08891a23-c70c-4fc3-a7d4-47ec69d3ea13', '{\"meta\":{\"id\":\"indiaMortgage\",\"country\":\"IN\",\"region\":\"NATIONAL\",\"calculator\":\"MORTGAGE\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-04-01\",\"effectiveTo\":null,\"currency\":\"INR\",\"currencySymbol\":\"₹\",\"source\":[{\"name\":\"Reserve Bank of India\",\"url\":\"https://www.rbi.org.in\"}]},\"inputs\":[{\"type\":\"number\",\"min\":1,\"isCurrency\":true,\"label\":\"PROPERTY_PRICE\",\"name\":\"propertyPrice\"},{\"type\":\"number\",\"min\":0,\"isCurrency\":true,\"label\":\"DOWN_PAYMENT\",\"slider\":{\"max\":50,\"min\":0,\"step\":1},\"name\":\"downPayment\"},{\"type\":\"number\",\"min\":0,\"label\":\"INTEREST_RATE\",\"slider\":{\"max\":15,\"min\":0.5,\"step\":0.1},\"name\":\"interestRate\"},{\"type\":\"number\",\"min\":1,\"label\":\"LOAN_DURATION\",\"name\":\"amortizationYears\"},{\"type\":\"boolean\",\"label\":\"IS_FIRST_TIME_BUYER\",\"name\":\"isFirstTimeBuyer\"}],\"outputs\":[],\"rules\":{\"loanConstraints\":{\"maxLtvPercent\":80,\"maxAmortizationYears\":30},\"interest\":{\"compounding\":\"MONTHLY\"},\"stampDuty\":{\"rate\":0.05}}}', 0, '2025', '', NULL),
('dd3c312c-cd12-45e6-a4d5-eda181d0bea6', 'de10134b-ffab-4835-b608-592934b4331e', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b', '{\"meta\":{\"id\":\"jp-capital-gains\",\"country\":\"JP\",\"region\":\"NATIONAL\",\"calculator\":\"CAPITAL_GAINS\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"JPY\",\"currencySymbol\":\"¥\",\"source\":[{\"name\":\"National Tax Agency Japan\",\"url\":\"https://www.nta.go.jp\"}]},\"inputs\":[{\"name\":\"capitalGain\",\"type\":\"number\",\"required\":true,\"unit\":\"JPY\",\"isCurrency\":true,\"label\":\"CAPITAL_GAIN\"}],\"outputs\":[],\"rules\":{\"flatRate\":0.20315}}', 0, '2025', '', NULL),
('e4a5fbd9-7675-4931-ba0f-cdaa36a786a3', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', 'cdadfc67-5dff-49f3-9b11-a601cc374938', '{\n  \"meta\": {\n    \"id\": \"au-mortgage-2024\",\n    \"country\": \"AU\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"MORTGAGE\",\n    \"version\": \"2024.1\",\n    \"effectiveFrom\": \"2024-01-01\",\n    \"currency\": \"AUD\",\n    \"currencySymbol\": \"$\",\n    \"source\": [\n      {\n        \"name\": \"Australian lenders – general serviceability & LVR guidelines\",\n        \"url\": \"https://moneysmart.gov.au/home-loans\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"type\": \"number\",\n      \"min\": 1,\n      \"isCurrency\": true,\n      \"label\": \"PROPERTY_PRICE\",\n      \"name\": \"propertyPrice\"\n    },\n    {\n      \"type\": \"number\",\n      \"min\": 0,\n      \"isCurrency\": true,\n      \"label\": \"DOWN_PAYMENT\",\n      \"slider\": { \"max\": 50, \"min\": 0, \"step\": 1 },\n      \"name\": \"downPayment\"\n    },\n    {\n      \"type\": \"number\",\n      \"min\": 0,\n      \"label\": \"INTEREST_RATE\",\n      \"slider\": { \"max\": 12, \"min\": 0.5, \"step\": 0.1 },\n      \"name\": \"interestRate\"\n    },\n    {\n      \"type\": \"number\",\n      \"min\": 1,\n      \"label\": \"LOAN_DURATION\",\n      \"name\": \"amortizationYears\"\n    },\n    {\n      \"type\": \"number\",\n      \"min\": 1,\n      \"isCurrency\": true,\n      \"label\": \"MONTHLY_GROSS_INCOME\",\n      \"name\": \"grossMonthlyIncome\"\n    }\n  ],\n  \"rules\": {\n    \"loanConstraints\": {\n      \"maxLtv\": 0.95,\n      \"minDownPaymentPercent\": 5,\n      \"maxAmortizationYears\": 30,\n      \"maxDebtToIncomePercent\": 35\n    },\n    \"interest\": {\n      \"type\": \"variable\",\n      \"rateRangePercent\": { \"min\": 5.0, \"max\": 10.0 },\n      \"stressTestBufferPercent\": 3.0\n    },\n\n    \"lendersMortgageInsurance\": {\n      \"enabled\": true,\n      \"requiredAboveLvr\": 0.8,\n      \"capitalisedIntoLoanAllowed\": true,\n      \"premiumAddedToLoan\": {\n        \"type\": \"external\",\n        \"description\": \"LMI premium varies by lender, LVR, loan size, and borrower profile. If you want, we can encode a default table by LVR bands.\"\n      },\n     \"premiumRates\": [\n            { \"maxLvr\": 0.85, \"rate\": 0.006 },\n            { \"maxLvr\": 0.90, \"rate\": 0.012 },\n            { \"maxLvr\": 0.95, \"rate\": 0.022 }\n        ]\n      },\n\n    \"stampDuty\": {\n        \"brackets\": [\n            { \"upTo\": 14000, \"rate\": 0.014 },\n            { \"upTo\": 32000, \"rate\": 0.035 },\n            { \"upTo\": 85000, \"rate\": 0.045 },\n            { \"upTo\": 319000, \"rate\": 0.0475 },\n            { \"upTo\": 1000000, \"rate\": 0.05 },\n            { \"above\": 1000000, \"rate\": 0.055 }\n        ]\n    },\n    \"insurance\": {\n      \"lmi\": {\n        \"requiredAboveLvr\": 0.8,\n        \"enabled\": true\n      }\n    },\n\n    \"fees\": {\n      \"governmentFees\": {\n        \"stampDuty\": {\n          \"type\": \"external\",\n          \"description\": \"Stamp duty varies by state/territory; implement state tables if you decide to add state input.\"\n        }\n      }\n    }\n  },\n  \"outputs\": {\n    \"loanAmount\": \"number\",\n    \"monthlyPayment\": \"number\",\n    \"totalInterestPaid\": \"number\",\n    \"totalPaid\": \"number\",\n    \"debtToIncomeRatio\": \"number\",\n    \"isAffordable\": \"boolean\",\n    \"estimatedStampDuty\": \"number\",\n    \"lmiEstimated\": \"number\"\n  }\n}', 0, '2025', '', NULL),
('eab6b11e-8b70-46cc-beca-f2e0a03ef07b', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', 'f28b71e8-12dd-4e6c-a56c-9cabafb4efcf', '{\n  \"meta\": {\n    \"id\": \"zaInheritanceTax\",\n    \"country\": \"ZA\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INHERITANCE_TAX\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"ZAR\",\n    \"currencySymbol\": \"R\",\n    \"source\": [\n      {\n        \"name\": \"HM Revenue & Customs (HMRC)\",\n        \"url\": \"https://www.gov.uk/government/organisations/hm-revenue-customs\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"estateValue\",\n      \"label\": \"ESTATE_VALUE\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"ZAR\",\n      \"isCurrency\": true\n    },\n    {\n        \"name\": \"deductions\",\n        \"label\": \"DEDUCTIONS\",\n        \"type\": \"number\",\n        \"required\": false,\n        \"unit\": \"ZAR\",\n        \"isCurrency\": true\n    }\n  ],\n  \"outputs\": [],\n  \"rules\": {\n    \"primaryAbatement\": 3500000,\n    \"taxBrackets\": [\n        { \"from\": 0, \"to\": 30000000, \"rate\": 0.20 },\n        { \"from\": 30000000, \"to\": null, \"rate\": 0.25 }\n    ]\n}\n}', 0, '2025', '', NULL),
('f13b684c-3c4c-4907-b097-c1ea0dfdfb98', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b', '{\"meta\":{\"id\":\"japanIncomeTax\",\"country\":\"JP\",\"region\":\"NATIONAL\",\"calculator\":\"INCOME_TAX\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-01-01\",\"effectiveTo\":null,\"currency\":\"JPY\",\"currencySymbol\":\"¥\",\"source\":[{\"name\":\"National Tax Agency Japan\",\"url\":\"https://www.nta.go.jp\"}]},\"inputs\":[{\"name\":\"income\",\"label\":\"ANNUAL_GROSS_INCOME\",\"type\":\"number\",\"required\":true,\"unit\":\"JPY\",\"isCurrency\":true}],\"outputs\":[],\"rules\":{\"taxBrackets\":[{\"from\":0,\"to\":1950000,\"rate\":0.05},{\"from\":1950000,\"to\":3300000,\"rate\":0.10},{\"from\":3300000,\"to\":6950000,\"rate\":0.20},{\"from\":6950000,\"to\":9000000,\"rate\":0.23},{\"from\":9000000,\"to\":18000000,\"rate\":0.33},{\"from\":18000000,\"to\":40000000,\"rate\":0.40},{\"from\":40000000,\"to\":null,\"rate\":0.45}],\"inhabitantTax\":{\"rate\":0.10}}}', 0, '2025', '', NULL),
('f2e46984-0f15-4421-afd2-56b9680a3331', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', '08891a23-c70c-4fc3-a7d4-47ec69d3ea13', '{\"meta\":{\"id\":\"indiaIncomeTax\",\"country\":\"IN\",\"region\":\"NATIONAL\",\"calculator\":\"INCOME_TAX\",\"version\":\"2026.1\",\"effectiveFrom\":\"2026-04-01\",\"effectiveTo\":null,\"currency\":\"INR\",\"currencySymbol\":\"₹\",\"source\":[{\"name\":\"Income Tax Department India\",\"url\":\"https://www.incometax.gov.in\"}]},\"inputs\":[{\"name\":\"income\",\"label\":\"ANNUAL_GROSS_INCOME\",\"type\":\"number\",\"required\":true,\"unit\":\"INR\",\"isCurrency\":true}],\"outputs\":[],\"rules\":{\"taxBrackets\":[{\"from\":0,\"to\":400000,\"rate\":0},{\"from\":400000,\"to\":800000,\"rate\":0.05},{\"from\":800000,\"to\":1200000,\"rate\":0.10},{\"from\":1200000,\"to\":1600000,\"rate\":0.15},{\"from\":1600000,\"to\":2000000,\"rate\":0.20},{\"from\":2000000,\"to\":2400000,\"rate\":0.25},{\"from\":2400000,\"to\":null,\"rate\":0.30}],\"cess\":{\"rate\":0.04}}}', 0, '2025', '', NULL),
('f3b9d5a2-24ee-4a2f-81d4-91e597898958', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', '5a7422ce-aed0-4f33-b51b-465e852ed9e2', '{\n  \"meta\": {\n    \"id\": \"germanyMortgageCalculator\",\n    \"country\": \"GE\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"MORTGAGE\",\n    \"version\": \"2025.1\",\n    \"effectiveFrom\": \"2025-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"EUR\",\n    \"currencySymbol\": \"€\",\n    \"source\": [\n      {\n        \"name\": \"Germany revenue\",\n        \"url\": \"https://www.germany-tax.ge\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"type\": \"number\",\n      \"min\": 1,\n      \"isCurrency\": true,\n      \"label\": \"PROPERTY_PRICE\",\n      \"name\": \"propertyPrice\"\n    },\n    {\n      \"type\": \"number\",\n      \"min\": 0,\n      \"isCurrency\": true,\n      \"label\": \"DOWN_PAYMENT\",\n      \"slider\": { \"max\": 50, \"min\": 0, \"step\": 1 },\n      \"name\": \"downPayment\"\n    },\n    {\n      \"type\": \"number\",\n      \"min\": 0,\n      \"label\": \"INTEREST_RATE\",\n      \"slider\": { \"max\": 12, \"min\": 0.5, \"step\": 0.1 },\n      \"name\": \"interestRate\"\n    },\n    {\n      \"type\": \"number\",\n      \"min\": 1,\n      \"label\": \"LOAN_DURATION\",\n      \"name\": \"amortizationYears\"\n    },\n    {\n      \"type\": \"number\",\n      \"min\": 1,\n      \"isCurrency\": true,\n      \"label\": \"MONTHLY_GROSS_INCOME\",\n      \"name\": \"grossMonthlyIncome\"\n    }\n  ],\n  \"outputs\": [ ],\n  \"rules\": {\n    \"loanConstraints\": {\n        \"maxLtvPercent\": 80,\n        \"maxAmortizationYears\": 30\n    },\n    \"interest\": {\n        \"compounding\": \"MONTHLY\"\n    },\n    \"landTransferTax\": {\n        \"rate\": 0.035\n    },\n    \"notaryFeeRate\": 0.015,\n    \"registrationFeeRate\": 0.005\n    }\n}', 0, '2025', '', NULL),
('f8c0d81f-e688-4762-b676-ec7ebad5fb9e', 'de10134b-ffab-4835-b608-592934b4331e', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '{\n  \"meta\": {\n    \"id\": \"ca-capital-gains\",\n    \"country\": \"CA\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"CAPITAL_GAINS\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-01-01\",\n    \"effectiveTo\": null,\n    \"source\": [\n      { \"name\": \"Canada Revenue Agency (CRA)\", \"url\": \"https://www.canada.ca/en/revenue-agency.html\" }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"capitalGain\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"CAD\",\n      \"isCurrency\": true,\n      \"label\": \"CAPITAL_GAIN\"\n    },\n    {\n      \"name\": \"totalTaxableIncome\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"CAD\",\n      \"isCurrency\": true,\n      \"label\": \"TOTAL_TAXABLE_INCOME\"\n    }\n  ],\n  \"outputs\": [\n    { \"name\": \"taxableCapitalGain\", \"type\": \"number\", \"unit\": \"CAD\" },\n    { \"name\": \"capitalGainsTax\", \"type\": \"number\", \"unit\": \"CAD\" },\n    { \"name\": \"effectiveRate\", \"type\": \"number\", \"unit\": \"PERCENT\" }\n  ],\n  \"rules\": {\n  \"inclusionRate\": 0.5,\n  \"taxBrackets\": [\n    { \"from\": 0, \"to\": 55867, \"rate\": 0.15 },\n    { \"from\": 55867, \"to\": 111733, \"rate\": 0.205 },\n    { \"from\": 111733, \"to\": 154906, \"rate\": 0.26 },\n    { \"from\": 154906, \"to\": 220000, \"rate\": 0.29 },\n    { \"from\": 220000, \"to\": null, \"rate\": 0.33 }\n  ]\n}\n}', 0, '2025', '', NULL),
('fd00e390-9a81-4494-ae6c-15ac8c914af9', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', '103e8f49-f86a-4312-8cb9-511f872e5d84', '{\n  \"meta\": {\n    \"id\": \"ukInheritanceTax\",\n    \"country\": \"GB\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INHERITANCE_TAX\",\n    \"version\": \"2026.1\",\n    \"effectiveFrom\": \"2026-04-06\",\n    \"effectiveTo\": null,\n    \"currency\": \"GBP\",\n    \"currencySymbol\": \"£\",\n    \"source\": [\n      {\n        \"name\": \"HM Revenue & Customs (HMRC)\",\n        \"url\": \"https://www.gov.uk/government/organisations/hm-revenue-customs\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"estateValue\",\n      \"label\": \"ESTATE_VALUE\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"GBP\",\n      \"isCurrency\": true\n    },\n    {\n        \"name\": \"charitableGivingPercent\",\n        \"label\": \"CHARITABLE_GIVING_PERCENT\",\n        \"type\": \"number\",\n        \"required\": false,\n        \"unit\": \"percent\",\n        \"default\": 0\n    }\n  ],\n  \"outputs\": [],\n  \"rules\": {\n        \"nilRateBand\": 325000,\n        \"standardRate\": 0.40,\n        \"charityRate\": 0.36,\n        \"charityThreshold\": 10\n  }\n}', 0, '2025', '', NULL),
('fd4b8d36-7811-4bbd-b3df-59b7f1ae08d0', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', 'cdadfc67-5dff-49f3-9b11-a601cc374938', '{\n  \"meta\": {\n    \"id\": \"australiaIncomeTax\",\n    \"country\": \"AU\",\n    \"region\": \"NATIONAL\",\n    \"calculator\": \"INCOME_TAX\",\n    \"version\": \"2024.1\",\n    \"effectiveFrom\": \"2024-07-01\",\n    \"effectiveTo\": null,\n    \"currency\": \"AUD\",\n    \"currencySymbol\": \"$\",\n    \"source\": [\n      {\n        \"name\": \"Australian Taxation Office (ATO)\",\n        \"url\": \"https://www.ato.gov.au\"\n      }\n    ]\n  },\n  \"inputs\": [\n    {\n      \"name\": \"income\",\n      \"type\": \"number\",\n      \"required\": true,\n      \"unit\": \"AUD\",\n      \"isCurrency\": true,\n      \"label\": \"ANNUAL_TAXABLE_INCOME\"\n    },\n    {\n      \"name\": \"isResident\",\n      \"type\": \"boolean\",\n      \"required\": false,\n      \"default\": true,\n      \"label\": \"TAX_RESIDENCY_STATUS\"\n    },\n    {\n      \"name\": \"includeMedicareLevy\",\n      \"type\": \"boolean\",\n      \"required\": false,\n      \"default\": true,\n      \"label\": \"INCLUDE_MEDICARE_LEVY\"\n    }\n  ],\n  \"outputs\": [\n    {\n      \"name\": \"incomeTax\",\n      \"type\": \"number\",\n      \"unit\": \"AUD\"\n    },\n    {\n      \"name\": \"medicareLevy\",\n      \"type\": \"number\",\n      \"unit\": \"AUD\"\n    },\n    {\n      \"name\": \"totalTax\",\n      \"type\": \"number\",\n      \"unit\": \"AUD\"\n    },\n    {\n      \"name\": \"netIncome\",\n      \"type\": \"number\",\n      \"unit\": \"AUD\"\n    },\n    {\n      \"name\": \"effectiveTaxRate\",\n      \"type\": \"number\"\n    }\n  ],\n  \"rules\": {\n    \"taxBrackets\": [\n      { \"from\": 0, \"to\": 18200, \"rate\": 0.0 },\n      { \"from\": 18201, \"to\": 45000, \"rate\": 0.16 },\n      { \"from\": 45001, \"to\": 135000, \"rate\": 0.30 },\n      { \"from\": 135001, \"to\": 190000, \"rate\": 0.37 },\n      { \"from\": 190001, \"to\": null, \"rate\": 0.45 }\n    ],\n    \"nonResidentTaxBrackets\": [\n      { \"from\": 0, \"to\": 135000, \"rate\": 0.30 },\n      { \"from\": 135001, \"to\": 190000, \"rate\": 0.37 },\n      { \"from\": 190001, \"to\": null, \"rate\": 0.45 }\n    ],\n    \"medicareLevy\": {\n      \"type\": \"flat\",\n      \"rate\": 0.02,\n      \"appliesWhen\": \"includeMedicareLevy == true AND isResident == true\"\n    },\n    \"lowIncomeTaxOffset\": {\n      \"maxOffset\": 0,\n      \"phaseOutStart\": 0,\n      \"phaseOutEnd\": 0,\n      \"phaseOutRate\": 0\n    },\n    \"lowAndMiddleIncomeTaxOffset\": {\n      \"maxOffset\": 0,\n      \"phaseOutStart\": 0,\n      \"phaseOutEnd\": 0,\n      \"phaseOutRate\": 0\n    }\n  }\n}', 0, '2025', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `calculator_provinces`
--

CREATE TABLE IF NOT EXISTS `calculator_provinces` (
  `ID` varchar(50) NOT NULL,
  `CalculatorTypeID` varchar(50) NOT NULL,
  `ProvinceID` varchar(50) NOT NULL,
  `JsonSchema` longtext NOT NULL,
  `Year` varchar(5) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `calculator_provinces`
--

INSERT INTO `calculator_provinces` (`ID`, `CalculatorTypeID`, `ProvinceID`, `JsonSchema`, `Year`, `CreatedAt`, `DisabledAt`) VALUES
('757f699b-97c7-4bde-813f-6fec0af8645e', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', '92353ec4-f345-11f0-88ca-b2d823275b51', '{\r\n  \"meta\": {\r\n    \"id\": \"ca-on-corporate\",\r\n    \"calculator\": \"corporateIncomeTax\",\r\n    \"level\": \"province\",\r\n    \"currency\": \"cad\",\r\n    \"version\": \"2025.1\"\r\n  },\r\n  \"inputs\": [\r\n    {\r\n      \"name\": \"taxableIncome\",\r\n      \"type\": \"number\",\r\n      \"required\": true\r\n    },\r\n    {\r\n      \"name\": \"isSmallBusiness\",\r\n      \"type\": \"boolean\",\r\n      \"required\": true\r\n    }\r\n  ],\r\n  \"outputs\": [\r\n    {\r\n      \"name\": \"provincialTax\",\r\n      \"type\": \"number\"\r\n    }\r\n  ],\r\n  \"rules\": {\r\n    \"regimes\": {\r\n      \"general\": {\r\n        \"type\": \"flat\",\r\n        \"rate\": 0.115\r\n      },\r\n      \"smallBusiness\": {\r\n        \"type\": \"flat\",\r\n        \"rate\": 0.032,\r\n        \"maxIncome\": 500000\r\n      }\r\n    }\r\n  }\r\n}', '2025', '', NULL),
('f28b71e8-12dd-4e6c-a56c-9cabafb4efcf', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', '92353ec4-f345-11f0-88ca-b2d823275b51', '{\n    \"meta\": {\n        \"id\": \"ca-on-2025\",\n        \"country\": \"CA\",\n        \"region\": \"ON\",\n        \"calculator\": \"INCOME_TAX\",\n        \"version\": \"2025.1\",\n        \"effectiveFrom\": \"2025-01-01\"\n    },\n\n    \"rules\": {\n        \"taxBrackets\": [\n            { \"from\": 0, \"to\": 49231, \"rate\": 0.0505 },\n            { \"from\": 49231, \"to\": 98463, \"rate\": 0.0915 },\n            { \"from\": 98463, \"to\": 150000, \"rate\": 0.1116 },\n            { \"from\": 150000, \"to\": null, \"rate\": 0.1316 }\n        ],\n        \"credits\": {\n            \"basicPersonalAmount\": {\n                \"amount\": 11865,\n                \"rate\": 0.0505\n            }\n        }\n    }\n}\n', '2025', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `calculator_types`
--

CREATE TABLE IF NOT EXISTS `calculator_types` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `calculator_types`
--

INSERT INTO `calculator_types` (`ID`, `Name`, `Description`, `CreatedAt`, `DisabledAt`) VALUES
('4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', 'INHERITANCE_TAX', 'Inheritance Tax Calculator', '', NULL),
('89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', 'INCOME_TAX', 'Income Tax Calculator', '', NULL),
('bdfdeb6b-9497-410a-8d83-8d6bd572bde4', 'MORTGAGE', 'Mortgage Calculator', '', NULL),
('de10134b-ffab-4835-b608-592934b4331e', 'CAPITAL_GAINS', 'Capital gain tax', '', NULL),
('f0a9d3dc-287b-4c5d-96a3-2acc91974079', 'CORPORATE_TAX', 'Corporate Tax', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

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

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`ID`, `Firstname`, `Lastname`, `Email`, `Phone`, `CountryDialCode`, `Company`, `CompanySize`, `SubscriptionId`, `IsSso`, `CreatedAt`, `DisabledAt`) VALUES
('1c389554-0652-49a1-b27b-0a1a620a29d0', 'Novha', '210122927', 'novhakaze@gmail.com', '900393', '+1', 'Novha corp', '1-10', 'cb8bb2e5-ab99-41d0-8401-f2a4f7c0902b', 1, '', NULL),
('672cb477-33ee-4507-8229-f317457461c1', 'Yan', 'Novha', 'novha_yan@hotmail.fr', '6363635', '+1', 'Annhd', '1-10', 'e88545c4-4742-4b94-b643-a069e066dfb9', 0, '', NULL),
('804c5ac5-800a-4ccd-b8be-fd06d36afa53', 'John', 'Doe', 'john.doe@example.com', '5551234567', '+1', 'Acme Corporation', '50-100', '326b0696-19f4-4bff-8ccf-9655e7425210', 1, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

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

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`ID`, `Name`, `Code`, `FlagUrl`, `Currency`, `CurrencySymbol`, `CreatedAt`, `DisabledAt`) VALUES
('0328a50e-d83b-45a6-a963-d19983e83763', 'BRAZIL', 'BR', 'www.brazil.gov.br', 'BRL', 'R$', '', NULL),
('08891a23-c70c-4fc3-a7d4-47ec69d3ea13', 'INDIA', 'IN', 'www.india.gov.in', 'INR', '₹', '', NULL),
('103e8f49-f86a-4312-8cb9-511f872e5d84', 'UNITED_KINGDOM', 'UK', 'www.uk.co.uk', 'GBP', '£', '', NULL),
('5a7422ce-aed0-4f33-b51b-465e852ed9e2', 'GERMANY', 'GE', 'www.germany.ge', 'EUR', '€', '', NULL),
('5ce41c58-4897-43b1-b494-09f1b2d27d73', 'CANADA', 'CA', 'http://www.example.com', 'CAD', '$', '', NULL),
('87dfdcf2-2f85-42c0-8eac-82957d98fd08', 'UNITED_STATES', 'US', 'www.usa.us', 'USD', '$', '', NULL),
('a4a3389e-785a-455a-aa7f-c9eb05a9a7e4', 'FRANCE', 'FR', 'www.example.com', 'EUR', '€', '', NULL),
('cdadfc67-5dff-49f3-9b11-a601cc374938', 'AUSTRALIA', 'AU', 'www.australia.au', 'AUD', '$', '', NULL),
('f0b2e6f0-1804-4485-9e70-7f0c26122e5b', 'JAPAN', 'JP', 'www.japan.go.jp', 'JPY', '¥', '', NULL),
('f28b71e8-12dd-4e6c-a56c-9cabafb4efcf', 'SOUTH_AFRICA', 'ZA', 'www.southafrica.co.za', 'ZAR', 'R', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expertise_countries`
--

CREATE TABLE IF NOT EXISTS `expertise_countries` (
  `ID` varchar(50) NOT NULL,
  `ExpertID` varchar(50) NOT NULL,
  `CalculatorCountryID` varchar(50) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `expertise_countries`
--

INSERT INTO `expertise_countries` (`ID`, `ExpertID`, `CalculatorCountryID`, `CreatedAt`, `DisabledAt`) VALUES
('18b1e55e-5f7f-42c3-b27b-cc601eccd408', 'apex-financial', '45fd5b41-e995-40f7-8268-62f9088083ae', '', NULL),
('1c838388-05c3-4de8-b94f-903c4dec5411', 'anna-bergstrom', '9c9e1651-c275-439d-bbb1-29eb54675922', '', NULL),
('22912bd3-27f3-4762-8959-63d31d98769d', 'david-okafor', '367e94cc-0a0a-4d8d-8f05-530b4e51b1a4', '', NULL),
('2b02158f-bbd4-45f1-8c9f-097965e4b915', 'goldstein-tax', 'bbbebe7d-a8a2-432e-87ae-e527445ce68d', '', NULL),
('2baa9ebf-222d-479d-9752-4ce0117573a0', '06c6e982-3128-4a6e-a308-b913bd220b4c', '367e94cc-0a0a-4d8d-8f05-530b4e51b1a4', '', NULL),
('2d0088de-229f-4f07-85d2-9b3abff716e2', '2d239a12-afcf-4504-9760-3297032f6279', '1003f505-6e9f-4b06-b880-8fe75a6fc633', '', NULL),
('699fcc11-af6d-4785-ad96-95754b133856', '06c6e982-3128-4a6e-a308-b913bd220b4c', '683b4c9e-1da2-499a-9cf3-3996a67c2d7f', '', NULL),
('69ed49ba-6c8b-4a30-b2b9-4129777157dd', 'edward-pemberton', '6e7d24af-cce9-4b4a-82ee-af104bb9fb35', '', NULL),
('801f8e56-dc31-484f-b20e-80e92bafd8e0', 'tradeflow-intl', '6e7d24af-cce9-4b4a-82ee-af104bb9fb35', '', NULL),
('84b4f3d5-a979-4017-8545-54d1668c82f6', 'priya-sharma', '45fd5b41-e995-40f7-8268-62f9088083ae', '', NULL),
('93c9531c-f8cc-49fa-94a9-82274ca9100a', '2d239a12-afcf-4504-9760-3297032f6279', 'a23c15c9-46d3-4872-8379-e82ceb223d8f', '', NULL),
('9b99eb6a-532f-473e-9a75-b09b44210127', 'mei-lin-wu', '1003f505-6e9f-4b06-b880-8fe75a6fc633', '', NULL),
('a16e9af6-e57e-4ed0-9854-be3419db153c', '06c6e982-3128-4a6e-a308-b913bd220b4c', '1003f505-6e9f-4b06-b880-8fe75a6fc633', '', NULL),
('b420ed3c-0b80-4d9c-a2f0-e9069d913a7d', '06c6e982-3128-4a6e-a308-b913bd220b4c', '45fd5b41-e995-40f7-8268-62f9088083ae', '', NULL),
('bf2569b6-004d-434b-8b86-bb35f2542e5f', 'edward-pemberton', 'bbbebe7d-a8a2-432e-87ae-e527445ce68d', '', NULL),
('c0801d66-b8cc-478d-b838-cdccd5390bc4', 'lucia-fernandez', 'a23c15c9-46d3-4872-8379-e82ceb223d8f', '', NULL),
('c8bc218e-c49e-4eb5-b828-4975c90f1c9c', 'summit-accounting', '9550a9c3-28b6-4676-862f-95e3223e9088', '', NULL),
('f3488366-f2bb-48af-b3e9-9d6ea679c899', 'anna-bergstrom', '6e7d24af-cce9-4b4a-82ee-af104bb9fb35', '', NULL),
('f3e0f780-9b05-4e09-9a6b-5a33e0031b4c', '2d239a12-afcf-4504-9760-3297032f6279', '9c9e1651-c275-439d-bbb1-29eb54675922', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `experts`
--

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

--
-- Dumping data for table `experts`
--

INSERT INTO `experts` (`ID`, `Name`, `Email`, `Phone`, `Bio`, `ProfilePictureUrl`, `ExpertTypeID`, `Role`, `Rating`, `ExpertStatusID`, `CreatedAt`, `DisabledAt`) VALUES
('06c6e982-3128-4a6e-a308-b913bd220b4c', 'Konate Bram', 'konate@gmail.com', '+14590058', '', '', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Advisor', 0, 'ef340e8d-e9c6-4e4c-95a6-3bc1f23d13c7', '', NULL),
('2d239a12-afcf-4504-9760-3297032f6279', 'Bob Dylan', 'bob.dylan@gmail.com', '+143789090334', 'Very professional known around the world.', '/images/profile.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Tax expert', 3, 'ef340e8d-e9c6-4e4c-95a6-3bc1f23d13c7', '', NULL),
('anna-bergstrom', 'Anna Bergstrom', 'anna.bergstrom@globalexperts.io', '+46705550106', 'Specialist in Scandinavian and EU tax systems with focus on cross-border income tax implications. Advises expatriates and digital nomads on optimal tax residency strategies.', '/images/experts/expert-06.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Nordic Tax Advisor', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('apex-financial', 'Apex Financial Group', 'info@apexfinancial.com', '+12125550111', 'Full-service financial advisory firm with offices in 12 countries. Provides comprehensive loan, mortgage, and tax consulting for enterprises and high-net-worth individuals.', '/images/experts/company-01.jpg', 'b1a3015f-171a-40dd-aa37-a60596048940', 'Global Financial Advisory', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('david-okafor', 'David Okafor', 'david.okafor@globalexperts.io', '+27825550105', 'International trade finance expert focused on African markets. Deep knowledge of customs regulations, HS code classification, and preferential trade agreements across SADC.', '/images/experts/expert-05.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Import & Trade Consultant', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('edward-pemberton', 'Edward Pemberton', 'edward.pemberton@globalexperts.io', '+44205550109', 'Former HMRC senior advisor with 30 years of experience in UK and EU tax policy. Author of multiple books on international tax planning and wealth structuring.', '/images/experts/expert-09.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'UK Tax Authority', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('goldstein-tax', 'Goldstein & Partners', 'contact@goldsteinpartners.de', '+49305550112', 'Leading European tax advisory firm specializing in corporate restructuring, transfer pricing, and cross-border tax optimization across the EU and OECD member states.', '/images/experts/company-02.jpg', 'b1a3015f-171a-40dd-aa37-a60596048940', 'International Tax Consultancy', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('homebound-lending', 'Homebound Lending Co.', 'support@homeboundlending.au', '+61295550113', 'Australia\'s premier digital mortgage platform offering comparison tools and expert advice for residential and investment property loans across ANZ markets.', '/images/experts/company-03.jpg', 'b1a3015f-171a-40dd-aa37-a60596048940', 'Mortgage Solutions Provider', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('james-mitchell', 'James Mitchell', 'james.mitchell@globalexperts.io', '+14165550101', 'Over 15 years of experience in consumer and commercial loan structuring across North American markets. Specializes in multi-currency lending and cross-border financing.', '/images/experts/expert-01.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Senior Loan Analyst', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('kenji-tanaka', 'Kenji Tanaka', 'kenji.tanaka@globalexperts.io', '+8135550103', 'Renowned corporate tax advisor with deep expertise in Japanese tax law and international treaties. Helps companies navigate Japan\'s complex tax landscape.', '/images/experts/expert-03.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Corporate Tax Strategist', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('lucia-fernandez', 'Lucia Fernandez', 'lucia.fernandez@globalexperts.io', '+55115550108', 'Mortgage financing expert across Latin American markets. Guides clients through complex property acquisition processes in Brazil, Mexico, Colombia, and Argentina.', '/images/experts/expert-08.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'LatAm Mortgage Expert', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('mei-lin-wu', 'Mei-Lin Wu', 'meilin.wu@globalexperts.io', '+86105550110', 'China trade specialist focusing on import/export duties, free trade zone regulations, and customs valuation. Assists companies navigating China-ASEAN trade corridors.', '/images/experts/expert-10.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Customs & Duties Analyst', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('omar-hassan', 'Omar Hassan', 'omar.hassan@globalexperts.io', '+97150550107', 'Expert in Middle Eastern and North African financial regulations. Specializes in Islamic finance-compliant loan structures and VAT/corporate tax in the GCC region.', '/images/experts/expert-07.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'MENA Finance Director', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('priya-sharma', 'Priya Sharma', 'priya.sharma@globalexperts.io', '+9198110104', 'Leading mortgage advisor specializing in residential and commercial property financing across India, UAE, and Southeast Asian markets. Known for innovative mortgage solutions.', '/images/experts/expert-04.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Mortgage Specialist', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('sarah-chen', 'Sarah Chen', 'sarah.chen@globalexperts.io', '+6591550102', 'Expert in APAC income tax compliance and cross-border tax optimization. Advises multinationals on tax-efficient structures across Singapore, Hong Kong, and Australia.', '/images/experts/expert-02.jpg', 'deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'Tax Compliance Director', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('summit-accounting', 'Summit Accounting', 'hello@summitaccounting.ca', '+14165550115', 'Award-winning accounting firm specializing in corporate tax planning, audit services, and financial compliance for SMEs and startups across North America.', '/images/experts/company-05.jpg', 'b1a3015f-171a-40dd-aa37-a60596048940', 'Corporate Tax & Accounting', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL),
('tradeflow-intl', 'TradeFlow International', 'info@tradeflowintl.co.uk', '+44205550114', 'Global trade advisory firm helping businesses navigate customs duties, tariffs, and import regulations. Experts in post-Brexit EU-UK trade and CPTPP compliance.', '/images/experts/company-04.jpg', 'b1a3015f-171a-40dd-aa37-a60596048940', 'Customs & Trade Advisory', 5, '88744263-4d19-4b25-a5dc-a4f5ef2c2f79', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expert_statuses`
--

CREATE TABLE IF NOT EXISTS `expert_statuses` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `expert_statuses`
--

INSERT INTO `expert_statuses` (`ID`, `Description`, `Code`, `CreatedAt`, `DisabledAt`) VALUES
('88744263-4d19-4b25-a5dc-a4f5ef2c2f79', 'Active', 'ACTIVE', '', NULL),
('ef340e8d-e9c6-4e4c-95a6-3bc1f23d13c7', 'Pending', 'PENDING', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expert_types`
--

CREATE TABLE IF NOT EXISTS `expert_types` (
  `ID` varchar(50) NOT NULL,
  `Code` varchar(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `expert_types`
--

INSERT INTO `expert_types` (`ID`, `Code`, `Name`, `CreatedAt`, `DisabledAt`) VALUES
('b1a3015f-171a-40dd-aa37-a60596048940', 'COMPANY', 'Company', '', NULL),
('deb2649a-01cc-40ce-aeea-7d5ae78eaaab', 'INDIVIDUAL', 'Individual', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `feature_flags`
--

CREATE TABLE IF NOT EXISTS `feature_flags` (
  `id` varchar(50) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL,
  `is_enabled` tinyint NOT NULL DEFAULT '0',
  `created_at` varchar(255) NOT NULL,
  `disabled_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fx_rates`
--

CREATE TABLE IF NOT EXISTS `fx_rates` (
  `ID` varchar(50) NOT NULL,
  `BaseCurrency` varchar(6) NOT NULL,
  `QuoteCurrency` varchar(6) NOT NULL,
  `Rate` decimal(10,4) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fx_rates`
--

INSERT INTO `fx_rates` (`ID`, `BaseCurrency`, `QuoteCurrency`, `Rate`, `CreatedAt`, `DisabledAt`) VALUES
('00e5f017-e26e-47a7-8cdd-7e528f6f23db', 'USD', 'USD', 1.0000, '', NULL),
('0f81c16e-7503-4849-9b9e-4323bc6d50ad', 'USD', 'EUR', 0.9200, '', NULL),
('4a2df692-b5a2-46c6-9a9b-91d29bf4f35b', 'USD', 'AUD', 1.5200, '', NULL),
('4e044618-a6ac-4944-85f2-6e9b1109d0a6', 'USD', 'GBP', 0.7900, '', NULL),
('ce37bcff-cce9-4c31-adea-4adfd9477816', 'USD', 'CAD', 1.3500, '', NULL),
('f815db8a-1b1e-4b83-a431-cd2493890172', 'USD', 'ZAR', 18.6000, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `payment_frequencies`
--

CREATE TABLE IF NOT EXISTS `payment_frequencies` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payment_frequencies`
--

INSERT INTO `payment_frequencies` (`ID`, `Description`, `Code`, `CreatedAt`, `DisabledAt`) VALUES
('0477c26e-5d2d-4a26-9ef0-d2dae204438c', 'Yearly', 'YEARLY', '', NULL),
('a80b1d16-ffc5-4865-9882-5576224151bf', 'Monthly', 'MONTHLY', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payment_statuses`
--

CREATE TABLE IF NOT EXISTS `payment_statuses` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payment_statuses`
--

INSERT INTO `payment_statuses` (`ID`, `Description`, `Code`, `CreatedAt`, `DisabledAt`) VALUES
('4dadaadf-6bbc-43a9-aef9-3c67b7aaa6d4', 'Initiated', 'INITIATED', '', NULL),
('8f8251fd-3567-4cf9-84c9-5da5ef903f7c', 'Rejected', 'REJECTED', '', NULL),
('b894d00b-7c0b-4273-8f95-f8fd17242d94', 'In Progress', 'IN_PROGRESS', '', NULL),
('e9506968-02db-466c-a23a-12701fb24701', 'Failure', 'FAILURE', '', NULL),
('f37cb89d-77bc-465c-a261-7e3d1e9e5379', 'Success', 'SUCCESS', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

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

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`ID`, `Description`, `Code`, `MaxApiCalculationsPerMonth`, `MaxCountries`, `ApiType`, `IsMostPopular`, `IsCustomPrice`, `MaxCalculators`, `CreatedAt`, `DisabledAt`) VALUES
('567f8455-e054-4937-9529-4f933becc5c0', 'Entreprise', 'ENTERPRISE', NULL, NULL, 'DEDICATED_SUPPORT', 0, 1, NULL, '', NULL),
('cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', 'Starter', 'STARTER', 10000, 5, 'BASIC_API', 0, 0, 3, '', NULL),
('f9214ed8-77a0-4373-9377-e025b0d29d64', 'Professional', 'PROFESSIONAL', 100000, 25, 'FULL_API', 1, 0, 5, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plan_prices`
--

CREATE TABLE IF NOT EXISTS `plan_prices` (
  `ID` varchar(50) NOT NULL,
  `PlanID` varchar(50) NOT NULL,
  `RegionID` varchar(50) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `plan_prices`
--

INSERT INTO `plan_prices` (`ID`, `PlanID`, `RegionID`, `Price`, `CreatedAt`, `DisabledAt`) VALUES
('4c13331e-fe4f-11f0-88ca-b2d823275b51', 'cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', '0526767c-c845-4bf1-84d3-7a3b2df7dd4b', 74.48, '', NULL),
('4c135358-fe4f-11f0-88ca-b2d823275b51', 'cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', '0c4d9c78-fa50-4a3e-bec8-16e4fb31f38e', 911.40, '', NULL),
('4c1355f6-fe4f-11f0-88ca-b2d823275b51', 'cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', '70f49529-13e7-4430-b647-590bb8ca4616', 49.00, '', NULL),
('4c1356a0-fe4f-11f0-88ca-b2d823275b51', 'cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', 'be45af04-89ef-4f33-9667-0e0385d78c22', 38.71, '', NULL),
('4c1357ae-fe4f-11f0-88ca-b2d823275b51', 'cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', 'be683b63-3978-4eec-9b99-74bcd2754ed8', 66.15, '', NULL),
('4c13583a-fe4f-11f0-88ca-b2d823275b51', 'cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', 'de0c2c2f-0c31-42a2-8c66-9e96672403ff', 45.08, '', NULL),
('63f8dbc8-fe4f-11f0-88ca-b2d823275b51', 'f9214ed8-77a0-4373-9377-e025b0d29d64', '0526767c-c845-4bf1-84d3-7a3b2df7dd4b', 302.48, '', NULL),
('63f8f202-fe4f-11f0-88ca-b2d823275b51', 'f9214ed8-77a0-4373-9377-e025b0d29d64', '0c4d9c78-fa50-4a3e-bec8-16e4fb31f38e', 3701.40, '', NULL),
('63f8f356-fe4f-11f0-88ca-b2d823275b51', 'f9214ed8-77a0-4373-9377-e025b0d29d64', '70f49529-13e7-4430-b647-590bb8ca4616', 199.00, '', NULL),
('63f8f3ce-fe4f-11f0-88ca-b2d823275b51', 'f9214ed8-77a0-4373-9377-e025b0d29d64', 'be45af04-89ef-4f33-9667-0e0385d78c22', 157.21, '', NULL),
('63f8f45a-fe4f-11f0-88ca-b2d823275b51', 'f9214ed8-77a0-4373-9377-e025b0d29d64', 'be683b63-3978-4eec-9b99-74bcd2754ed8', 268.65, '', NULL),
('63f8f4c8-fe4f-11f0-88ca-b2d823275b51', 'f9214ed8-77a0-4373-9377-e025b0d29d64', 'de0c2c2f-0c31-42a2-8c66-9e96672403ff', 183.08, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE IF NOT EXISTS `provinces` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Code` varchar(10) NOT NULL,
  `CountryID` varchar(50) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`ID`, `Name`, `Code`, `CountryID`, `CreatedAt`, `DisabledAt`) VALUES
('12353fdc-f345-11f0-88ca-b2d823275b51', 'Saskatchewan', 'SK', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('22353f82-f345-11f0-88ca-b2d823275b51', 'Quebec', 'QC', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('32353f1e-f345-11f0-88ca-b2d823275b51', 'Prince Edward Island', 'PE', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('42353e6a-f345-11f0-88ca-b2d823275b51', 'Nova Scotia', 'NS', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('52353dde-f345-11f0-88ca-b2d823275b51', 'Newfoundland and Labrador', 'NL', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('62353d7a-f345-11f0-88ca-b2d823275b51', 'New Brunswick', 'NB', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('72353ce4-f345-11f0-88ca-b2d823275b51', 'Manitoba', 'MB', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('8235349c-f345-11f0-88ca-b2d823275b51', 'British Columbia', 'BC', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('92353ec4-f345-11f0-88ca-b2d823275b51', 'Ontario', 'ON', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('b235402c-f345-11f0-88ca-b2d823275b51', 'Northwest Territories', 'NT', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('c235407c-f345-11f0-88ca-b2d823275b51', 'Nunavut', 'NU', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('d23540d6-f345-11f0-88ca-b2d823275b51', 'Yukon', 'YT', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL),
('z2351ce6-f345-11f0-88ca-b2d823275b51', 'Alberta', 'AB', '5ce41c58-4897-43b1-b494-09f1b2d27d73', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE IF NOT EXISTS `regions` (
  `ID` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Code` varchar(50) NOT NULL,
  `Currency` varchar(3) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `regions`
--

INSERT INTO `regions` (`ID`, `Name`, `Code`, `Currency`, `CreatedAt`, `DisabledAt`) VALUES
('0526767c-c845-4bf1-84d3-7a3b2df7dd4b', 'Australian Dollar', 'AUD', '$', '', NULL),
('0c4d9c78-fa50-4a3e-bec8-16e4fb31f38e', 'Rand', 'ZAR', 'R', '', NULL),
('70f49529-13e7-4430-b647-590bb8ca4616', 'US Dollar', 'USD', '$', '', NULL),
('be45af04-89ef-4f33-9667-0e0385d78c22', 'Pound Sterling', 'GBP', '£', '', NULL),
('be683b63-3978-4eec-9b99-74bcd2754ed8', 'Canadian Dollar', 'CAD', '$', '', NULL),
('de0c2c2f-0c31-42a2-8c66-9e96672403ff', 'Euro', 'EUR', '€', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

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
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`ID`, `StartDate`, `CurrentCost`, `CurrencyRegionCode`, `PlanId`, `PaymentFrequencyId`, `StatusId`, `SelectedCalculators`, `CreatedAt`, `DisabledAt`) VALUES
('326b0696-19f4-4bff-8ccf-9655e7425210', '2026-01-31 17:31:03', 49.99, 'USD', 'cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', 'a80b1d16-ffc5-4865-9882-5576224151bf', 'cd892490-c37e-43a0-8ac2-bf5ef4f06c59', '', '', NULL),
('cb8bb2e5-ab99-41d0-8401-f2a4f7c0902b', '2026-02-03 07:02:56', 40715.40, 'ZAR', 'f9214ed8-77a0-4373-9377-e025b0d29d64', '0477c26e-5d2d-4a26-9ef0-d2dae204438c', 'cd892490-c37e-43a0-8ac2-bf5ef4f06c59', '[\"4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d\",\"89e89a90-ebae-43d4-9c57-30e9f3b4a5bd\",\"f0a9d3dc-287b-4c5d-96a3-2acc91974079\"]', '', NULL),
('e88545c4-4742-4b94-b643-a069e066dfb9', '2026-02-03 20:04:38', 10025.40, 'ZAR', 'cf39c63c-6ebc-4a1f-896e-8b0f7aa00162', '0477c26e-5d2d-4a26-9ef0-d2dae204438c', 'cd892490-c37e-43a0-8ac2-bf5ef4f06c59', '[\"4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d\",\"89e89a90-ebae-43d4-9c57-30e9f3b4a5bd\",\"bdfdeb6b-9497-410a-8d83-8d6bd572bde4\"]', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subscription_cost_history`
--

CREATE TABLE IF NOT EXISTS `subscription_cost_history` (
  `ID` varchar(50) NOT NULL,
  `SubscriptionID` varchar(50) NOT NULL,
  `PlanID` varchar(50) NOT NULL,
  `Cost` decimal(10,2) NOT NULL,
  `EffectiveDate` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_statuses`
--

CREATE TABLE IF NOT EXISTS `subscription_statuses` (
  `ID` varchar(50) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Code` varchar(20) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `DisabledAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `subscription_statuses`
--

INSERT INTO `subscription_statuses` (`ID`, `Description`, `Code`, `CreatedAt`, `DisabledAt`) VALUES
('15a01e26-7bd8-436e-a891-042f7df6c1f9', 'Pending', 'PENDING', '', NULL),
('ae6fa3b1-f15b-4790-bbc6-87b6b0298ee8', 'Cancelled', 'CANCELLED', '', NULL),
('cd892490-c37e-43a0-8ac2-bf5ef4f06c59', 'Active', 'ACTIVE', '', NULL);

--
-- Indexes for dumped tables (idempotent — skips if already exists)
--

-- calculator_countries
CALL AddIndexIfNotExists('calculator_countries', 'PRIMARY', 'ALTER TABLE `calculator_countries` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('calculator_countries', 'FK_6292ab3c1f4ff07bf3a3e5062e5', 'ALTER TABLE `calculator_countries` ADD KEY `FK_6292ab3c1f4ff07bf3a3e5062e5` (`CountryID`)');
CALL AddIndexIfNotExists('calculator_countries', 'FK_c64e05f5b4ba491201748d4bf26', 'ALTER TABLE `calculator_countries` ADD KEY `FK_c64e05f5b4ba491201748d4bf26` (`CalculatorTypeID`)');

-- calculator_provinces
CALL AddIndexIfNotExists('calculator_provinces', 'PRIMARY', 'ALTER TABLE `calculator_provinces` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('calculator_provinces', 'FK_03a0eea008eb4ca1ab48a0ca796', 'ALTER TABLE `calculator_provinces` ADD KEY `FK_03a0eea008eb4ca1ab48a0ca796` (`ProvinceID`)');
CALL AddIndexIfNotExists('calculator_provinces', 'FK_1cab8e93ef3d00d2ee6bdc5e9c2', 'ALTER TABLE `calculator_provinces` ADD KEY `FK_1cab8e93ef3d00d2ee6bdc5e9c2` (`CalculatorTypeID`)');

-- calculator_types
CALL AddIndexIfNotExists('calculator_types', 'PRIMARY', 'ALTER TABLE `calculator_types` ADD PRIMARY KEY (`ID`)');

-- clients
CALL AddIndexIfNotExists('clients', 'PRIMARY', 'ALTER TABLE `clients` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('clients', 'REL_8e5f1736af0c63dede1ebb3d96', 'ALTER TABLE `clients` ADD UNIQUE KEY `REL_8e5f1736af0c63dede1ebb3d96` (`SubscriptionId`)');

-- countries
CALL AddIndexIfNotExists('countries', 'PRIMARY', 'ALTER TABLE `countries` ADD PRIMARY KEY (`ID`)');

-- expertise_countries
CALL AddIndexIfNotExists('expertise_countries', 'PRIMARY', 'ALTER TABLE `expertise_countries` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('expertise_countries', 'FK_d7ab0f5de497fc435a3d0a91cdd', 'ALTER TABLE `expertise_countries` ADD KEY `FK_d7ab0f5de497fc435a3d0a91cdd` (`ExpertID`)');
CALL AddIndexIfNotExists('expertise_countries', 'FK_a6271a8878edda40999d505fdb2', 'ALTER TABLE `expertise_countries` ADD KEY `FK_a6271a8878edda40999d505fdb2` (`CalculatorCountryID`)');

-- experts
CALL AddIndexIfNotExists('experts', 'PRIMARY', 'ALTER TABLE `experts` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('experts', 'FK_6ad235fcff122997f1e497139df', 'ALTER TABLE `experts` ADD KEY `FK_6ad235fcff122997f1e497139df` (`ExpertStatusID`)');
CALL AddIndexIfNotExists('experts', 'FK_694cddab18f832b25c098861aa0', 'ALTER TABLE `experts` ADD KEY `FK_694cddab18f832b25c098861aa0` (`ExpertTypeID`)');

-- expert_statuses
CALL AddIndexIfNotExists('expert_statuses', 'PRIMARY', 'ALTER TABLE `expert_statuses` ADD PRIMARY KEY (`ID`)');

-- expert_types
CALL AddIndexIfNotExists('expert_types', 'PRIMARY', 'ALTER TABLE `expert_types` ADD PRIMARY KEY (`ID`)');

-- feature_flags
CALL AddIndexIfNotExists('feature_flags', 'PRIMARY', 'ALTER TABLE `feature_flags` ADD PRIMARY KEY (`id`)');

-- fx_rates
CALL AddIndexIfNotExists('fx_rates', 'PRIMARY', 'ALTER TABLE `fx_rates` ADD PRIMARY KEY (`ID`)');

-- payments
CALL AddIndexIfNotExists('payments', 'PRIMARY', 'ALTER TABLE `payments` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('payments', 'FK_b1e3064068e1a05d37af0fec86a', 'ALTER TABLE `payments` ADD KEY `FK_b1e3064068e1a05d37af0fec86a` (`SubscriptionID`)');
CALL AddIndexIfNotExists('payments', 'FK_c9bf69bfc7ca9ea82aee7091708', 'ALTER TABLE `payments` ADD KEY `FK_c9bf69bfc7ca9ea82aee7091708` (`StatusId`)');

-- payment_frequencies
CALL AddIndexIfNotExists('payment_frequencies', 'PRIMARY', 'ALTER TABLE `payment_frequencies` ADD PRIMARY KEY (`ID`)');

-- payment_statuses
CALL AddIndexIfNotExists('payment_statuses', 'PRIMARY', 'ALTER TABLE `payment_statuses` ADD PRIMARY KEY (`ID`)');

-- plans
CALL AddIndexIfNotExists('plans', 'PRIMARY', 'ALTER TABLE `plans` ADD PRIMARY KEY (`ID`)');

-- plan_prices
CALL AddIndexIfNotExists('plan_prices', 'PRIMARY', 'ALTER TABLE `plan_prices` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('plan_prices', 'FK_09bd528f83f3908d5fad945e81f', 'ALTER TABLE `plan_prices` ADD KEY `FK_09bd528f83f3908d5fad945e81f` (`PlanID`)');
CALL AddIndexIfNotExists('plan_prices', 'FK_46cfee5eb5534e1e3256332f606', 'ALTER TABLE `plan_prices` ADD KEY `FK_46cfee5eb5534e1e3256332f606` (`RegionID`)');

-- provinces
CALL AddIndexIfNotExists('provinces', 'PRIMARY', 'ALTER TABLE `provinces` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('provinces', 'FK_8c1f4aad8475be025242b8b0e57', 'ALTER TABLE `provinces` ADD KEY `FK_8c1f4aad8475be025242b8b0e57` (`CountryID`)');

-- regions
CALL AddIndexIfNotExists('regions', 'PRIMARY', 'ALTER TABLE `regions` ADD PRIMARY KEY (`ID`)');

-- subscriptions
CALL AddIndexIfNotExists('subscriptions', 'PRIMARY', 'ALTER TABLE `subscriptions` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('subscriptions', 'FK_c72d661e6de8eb5820b6c6ea9e0', 'ALTER TABLE `subscriptions` ADD KEY `FK_c72d661e6de8eb5820b6c6ea9e0` (`PlanId`)');
CALL AddIndexIfNotExists('subscriptions', 'FK_1422f649c9c8c83ef5a675e0aff', 'ALTER TABLE `subscriptions` ADD KEY `FK_1422f649c9c8c83ef5a675e0aff` (`PaymentFrequencyId`)');
CALL AddIndexIfNotExists('subscriptions', 'FK_38a821d7b1cc006b3aea7fb8d10', 'ALTER TABLE `subscriptions` ADD KEY `FK_38a821d7b1cc006b3aea7fb8d10` (`StatusId`)');

-- subscription_cost_history
CALL AddIndexIfNotExists('subscription_cost_history', 'PRIMARY', 'ALTER TABLE `subscription_cost_history` ADD PRIMARY KEY (`ID`)');
CALL AddIndexIfNotExists('subscription_cost_history', 'FK_3d117809e14d93b8664ce50c9d6', 'ALTER TABLE `subscription_cost_history` ADD KEY `FK_3d117809e14d93b8664ce50c9d6` (`SubscriptionID`)');
CALL AddIndexIfNotExists('subscription_cost_history', 'FK_ef5f6c8a3d3b5ed301d4db0a112', 'ALTER TABLE `subscription_cost_history` ADD KEY `FK_ef5f6c8a3d3b5ed301d4db0a112` (`PlanID`)');

-- subscription_statuses
CALL AddIndexIfNotExists('subscription_statuses', 'PRIMARY', 'ALTER TABLE `subscription_statuses` ADD PRIMARY KEY (`ID`)');

--
-- Constraints for dumped tables (idempotent — skips if already exists)
--

-- calculator_countries
CALL AddConstraintIfNotExists('calculator_countries', 'FK_6292ab3c1f4ff07bf3a3e5062e5', 'ALTER TABLE `calculator_countries` ADD CONSTRAINT `FK_6292ab3c1f4ff07bf3a3e5062e5` FOREIGN KEY (`CountryID`) REFERENCES `countries` (`ID`)');
CALL AddConstraintIfNotExists('calculator_countries', 'FK_c64e05f5b4ba491201748d4bf26', 'ALTER TABLE `calculator_countries` ADD CONSTRAINT `FK_c64e05f5b4ba491201748d4bf26` FOREIGN KEY (`CalculatorTypeID`) REFERENCES `calculator_types` (`ID`)');

-- calculator_provinces
CALL AddConstraintIfNotExists('calculator_provinces', 'FK_03a0eea008eb4ca1ab48a0ca796', 'ALTER TABLE `calculator_provinces` ADD CONSTRAINT `FK_03a0eea008eb4ca1ab48a0ca796` FOREIGN KEY (`ProvinceID`) REFERENCES `provinces` (`ID`)');
CALL AddConstraintIfNotExists('calculator_provinces', 'FK_1cab8e93ef3d00d2ee6bdc5e9c2', 'ALTER TABLE `calculator_provinces` ADD CONSTRAINT `FK_1cab8e93ef3d00d2ee6bdc5e9c2` FOREIGN KEY (`CalculatorTypeID`) REFERENCES `calculator_types` (`ID`)');

-- clients
CALL AddConstraintIfNotExists('clients', 'FK_8e5f1736af0c63dede1ebb3d969', 'ALTER TABLE `clients` ADD CONSTRAINT `FK_8e5f1736af0c63dede1ebb3d969` FOREIGN KEY (`SubscriptionId`) REFERENCES `subscriptions` (`ID`)');

-- expertise_countries
CALL AddConstraintIfNotExists('expertise_countries', 'FK_a6271a8878edda40999d505fdb2', 'ALTER TABLE `expertise_countries` ADD CONSTRAINT `FK_a6271a8878edda40999d505fdb2` FOREIGN KEY (`CalculatorCountryID`) REFERENCES `calculator_countries` (`ID`)');
CALL AddConstraintIfNotExists('expertise_countries', 'FK_d7ab0f5de497fc435a3d0a91cdd', 'ALTER TABLE `expertise_countries` ADD CONSTRAINT `FK_d7ab0f5de497fc435a3d0a91cdd` FOREIGN KEY (`ExpertID`) REFERENCES `experts` (`ID`)');

-- experts
CALL AddConstraintIfNotExists('experts', 'FK_694cddab18f832b25c098861aa0', 'ALTER TABLE `experts` ADD CONSTRAINT `FK_694cddab18f832b25c098861aa0` FOREIGN KEY (`ExpertTypeID`) REFERENCES `expert_types` (`ID`)');
CALL AddConstraintIfNotExists('experts', 'FK_6ad235fcff122997f1e497139df', 'ALTER TABLE `experts` ADD CONSTRAINT `FK_6ad235fcff122997f1e497139df` FOREIGN KEY (`ExpertStatusID`) REFERENCES `expert_statuses` (`ID`)');

-- payments
CALL AddConstraintIfNotExists('payments', 'FK_b1e3064068e1a05d37af0fec86a', 'ALTER TABLE `payments` ADD CONSTRAINT `FK_b1e3064068e1a05d37af0fec86a` FOREIGN KEY (`SubscriptionID`) REFERENCES `subscriptions` (`ID`)');
CALL AddConstraintIfNotExists('payments', 'FK_c9bf69bfc7ca9ea82aee7091708', 'ALTER TABLE `payments` ADD CONSTRAINT `FK_c9bf69bfc7ca9ea82aee7091708` FOREIGN KEY (`StatusId`) REFERENCES `payment_statuses` (`ID`)');

-- plan_prices
CALL AddConstraintIfNotExists('plan_prices', 'FK_09bd528f83f3908d5fad945e81f', 'ALTER TABLE `plan_prices` ADD CONSTRAINT `FK_09bd528f83f3908d5fad945e81f` FOREIGN KEY (`PlanID`) REFERENCES `plans` (`ID`)');
CALL AddConstraintIfNotExists('plan_prices', 'FK_46cfee5eb5534e1e3256332f606', 'ALTER TABLE `plan_prices` ADD CONSTRAINT `FK_46cfee5eb5534e1e3256332f606` FOREIGN KEY (`RegionID`) REFERENCES `regions` (`ID`)');

-- provinces
CALL AddConstraintIfNotExists('provinces', 'FK_8c1f4aad8475be025242b8b0e57', 'ALTER TABLE `provinces` ADD CONSTRAINT `FK_8c1f4aad8475be025242b8b0e57` FOREIGN KEY (`CountryID`) REFERENCES `countries` (`ID`)');

-- subscriptions
CALL AddConstraintIfNotExists('subscriptions', 'FK_1422f649c9c8c83ef5a675e0aff', 'ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_1422f649c9c8c83ef5a675e0aff` FOREIGN KEY (`PaymentFrequencyId`) REFERENCES `payment_frequencies` (`ID`)');
CALL AddConstraintIfNotExists('subscriptions', 'FK_38a821d7b1cc006b3aea7fb8d10', 'ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_38a821d7b1cc006b3aea7fb8d10` FOREIGN KEY (`StatusId`) REFERENCES `subscription_statuses` (`ID`)');
CALL AddConstraintIfNotExists('subscriptions', 'FK_c72d661e6de8eb5820b6c6ea9e0', 'ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_c72d661e6de8eb5820b6c6ea9e0` FOREIGN KEY (`PlanId`) REFERENCES `plans` (`ID`)');

-- subscription_cost_history
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
