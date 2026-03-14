-- Migration: Add Brazil, India, and Japan as countries
-- Date: 2026-03-14

-- =============================================
-- 1. INSERT COUNTRIES
-- =============================================

INSERT INTO countries (ID, Name, Code, Currency, CurrencySymbol, FlagUrl, CreatedAt, DisabledAt) VALUES
('0328a50e-d83b-45a6-a963-d19983e83763', 'BRAZIL', 'BR', 'BRL', 'R$', 'www.brazil.gov.br', '', NULL),
('08891a23-c70c-4fc3-a7d4-47ec69d3ea13', 'INDIA', 'IN', 'INR', '₹', 'www.india.gov.in', '', NULL),
('f0b2e6f0-1804-4485-9e70-7f0c26122e5b', 'JAPAN', 'JP', 'JPY', '¥', 'www.japan.go.jp', '', NULL);

-- =============================================
-- 2. CALCULATOR_COUNTRIES: BRAZIL
-- =============================================

-- Brazil Income Tax
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('dab21abf-6876-4d18-84de-c7df52dd2d49', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', '0328a50e-d83b-45a6-a963-d19983e83763',
'{"meta":{"id":"brazilIncomeTax","country":"BR","region":"NATIONAL","calculator":"INCOME_TAX","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"BRL","currencySymbol":"R$","source":[{"name":"Receita Federal do Brasil","url":"https://www.gov.br/receitafederal"}]},"inputs":[{"name":"income","label":"ANNUAL_GROSS_INCOME","type":"number","required":true,"unit":"BRL","isCurrency":true}],"outputs":[],"rules":{"taxBrackets":[{"from":0,"to":26963.20,"rate":0},{"from":26963.20,"to":33919.80,"rate":0.075},{"from":33919.80,"to":45012.60,"rate":0.15},{"from":45012.60,"to":55976.16,"rate":0.225},{"from":55976.16,"to":null,"rate":0.275}],"inss":{"rate":0.14,"cap":8786.56}}}',
0, '2026', '', NULL);

-- Brazil Corporate Tax
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('91d82e55-f8b2-4dbe-877e-05b63241fc54', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', '0328a50e-d83b-45a6-a963-d19983e83763',
'{"meta":{"id":"brazilCorporateTax","country":"BR","region":"NATIONAL","calculator":"CORPORATE_TAX","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"BRL","currencySymbol":"R$","source":[{"name":"Receita Federal do Brasil","url":"https://www.gov.br/receitafederal"}]},"inputs":[{"name":"taxableIncome","type":"number","required":true,"unit":"BRL","isCurrency":true,"label":"TAXABLE_INCOME"}],"outputs":[],"rules":{"irpj":{"baseRate":0.15,"surchargeRate":0.10,"surchargeThreshold":240000},"csll":{"rate":0.09}}}',
0, '2026', '', NULL);

-- Brazil Mortgage
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('699292ce-3ed3-4081-8b7e-f117ad843614', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', '0328a50e-d83b-45a6-a963-d19983e83763',
'{"meta":{"id":"brazilMortgage","country":"BR","region":"NATIONAL","calculator":"MORTGAGE","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"BRL","currencySymbol":"R$","source":[{"name":"Banco Central do Brasil","url":"https://www.bcb.gov.br"}]},"inputs":[{"type":"number","min":1,"isCurrency":true,"label":"PROPERTY_PRICE","name":"propertyPrice"},{"type":"number","min":0,"isCurrency":true,"label":"DOWN_PAYMENT","slider":{"max":50,"min":0,"step":1},"name":"downPayment"},{"type":"number","min":0,"label":"INTEREST_RATE","slider":{"max":15,"min":0.5,"step":0.1},"name":"interestRate"},{"type":"number","min":1,"label":"LOAN_DURATION","name":"amortizationYears"},{"type":"boolean","label":"IS_FIRST_TIME_BUYER","name":"isFirstTimeBuyer"}],"outputs":[],"rules":{"loanConstraints":{"maxLtvPercent":80,"maxAmortizationYears":35},"interest":{"compounding":"MONTHLY"},"itbi":{"rate":0.03}}}',
0, '2026', '', NULL);

-- Brazil Capital Gains
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('b0f5fdd9-8b49-4f71-8e47-d7ea9a4ef8e1', 'de10134b-ffab-4835-b608-592934b4331e', '0328a50e-d83b-45a6-a963-d19983e83763',
'{"meta":{"id":"br-capital-gains","country":"BR","region":"NATIONAL","calculator":"CAPITAL_GAINS","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"BRL","currencySymbol":"R$","source":[{"name":"Receita Federal do Brasil","url":"https://www.gov.br/receitafederal"}]},"inputs":[{"name":"capitalGain","type":"number","required":true,"unit":"BRL","isCurrency":true,"label":"CAPITAL_GAIN"}],"outputs":[],"rules":{"brackets":[{"from":0,"to":5000000,"rate":0.15},{"from":5000000,"to":10000000,"rate":0.175},{"from":10000000,"to":30000000,"rate":0.20},{"from":30000000,"to":null,"rate":0.225}]}}',
0, '2026', '', NULL);

-- =============================================
-- 3. CALCULATOR_COUNTRIES: INDIA
-- =============================================

-- India Income Tax
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('f2e46984-0f15-4421-afd2-56b9680a3331', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', '08891a23-c70c-4fc3-a7d4-47ec69d3ea13',
'{"meta":{"id":"indiaIncomeTax","country":"IN","region":"NATIONAL","calculator":"INCOME_TAX","version":"2026.1","effectiveFrom":"2026-04-01","effectiveTo":null,"currency":"INR","currencySymbol":"₹","source":[{"name":"Income Tax Department India","url":"https://www.incometax.gov.in"}]},"inputs":[{"name":"income","label":"ANNUAL_GROSS_INCOME","type":"number","required":true,"unit":"INR","isCurrency":true}],"outputs":[],"rules":{"taxBrackets":[{"from":0,"to":400000,"rate":0},{"from":400000,"to":800000,"rate":0.05},{"from":800000,"to":1200000,"rate":0.10},{"from":1200000,"to":1600000,"rate":0.15},{"from":1600000,"to":2000000,"rate":0.20},{"from":2000000,"to":2400000,"rate":0.25},{"from":2400000,"to":null,"rate":0.30}],"cess":{"rate":0.04}}}',
0, '2026', '', NULL);

-- India Corporate Tax
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('dbb57deb-e9ee-4739-87c6-6b56319c3f92', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', '08891a23-c70c-4fc3-a7d4-47ec69d3ea13',
'{"meta":{"id":"indiaCorporateTax","country":"IN","region":"NATIONAL","calculator":"CORPORATE_TAX","version":"2026.1","effectiveFrom":"2026-04-01","effectiveTo":null,"currency":"INR","currencySymbol":"₹","source":[{"name":"Income Tax Department India","url":"https://www.incometax.gov.in"}]},"inputs":[{"name":"taxableIncome","type":"number","required":true,"unit":"INR","isCurrency":true,"label":"TAXABLE_INCOME"}],"outputs":[],"rules":{"regime":{"type":"flat","rate":0.2542}}}',
0, '2026', '', NULL);

-- India Mortgage
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('dd384352-33b5-4f8f-9367-b53d51107b1c', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', '08891a23-c70c-4fc3-a7d4-47ec69d3ea13',
'{"meta":{"id":"indiaMortgage","country":"IN","region":"NATIONAL","calculator":"MORTGAGE","version":"2026.1","effectiveFrom":"2026-04-01","effectiveTo":null,"currency":"INR","currencySymbol":"₹","source":[{"name":"Reserve Bank of India","url":"https://www.rbi.org.in"}]},"inputs":[{"type":"number","min":1,"isCurrency":true,"label":"PROPERTY_PRICE","name":"propertyPrice"},{"type":"number","min":0,"isCurrency":true,"label":"DOWN_PAYMENT","slider":{"max":50,"min":0,"step":1},"name":"downPayment"},{"type":"number","min":0,"label":"INTEREST_RATE","slider":{"max":15,"min":0.5,"step":0.1},"name":"interestRate"},{"type":"number","min":1,"label":"LOAN_DURATION","name":"amortizationYears"},{"type":"boolean","label":"IS_FIRST_TIME_BUYER","name":"isFirstTimeBuyer"}],"outputs":[],"rules":{"loanConstraints":{"maxLtvPercent":80,"maxAmortizationYears":30},"interest":{"compounding":"MONTHLY"},"stampDuty":{"rate":0.05}}}',
0, '2026', '', NULL);

-- India Capital Gains
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('2b8e54a1-c773-4838-a184-45f46f0b4b5d', 'de10134b-ffab-4835-b608-592934b4331e', '08891a23-c70c-4fc3-a7d4-47ec69d3ea13',
'{"meta":{"id":"in-capital-gains","country":"IN","region":"NATIONAL","calculator":"CAPITAL_GAINS","version":"2026.1","effectiveFrom":"2026-04-01","effectiveTo":null,"currency":"INR","currencySymbol":"₹","source":[{"name":"Income Tax Department India","url":"https://www.incometax.gov.in"}]},"inputs":[{"name":"capitalGain","type":"number","required":true,"unit":"INR","isCurrency":true,"label":"CAPITAL_GAIN"},{"name":"holdingPeriodMonths","type":"number","required":false,"label":"HOLDING_PERIOD_MONTHS"}],"outputs":[],"rules":{"shortTermRate":0.20,"longTermRate":0.125,"longTermExemption":125000}}',
0, '2026', '', NULL);

-- =============================================
-- 4. CALCULATOR_COUNTRIES: JAPAN
-- =============================================

-- Japan Income Tax
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('f13b684c-3c4c-4907-b097-c1ea0dfdfb98', '89e89a90-ebae-43d4-9c57-30e9f3b4a5bd', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b',
'{"meta":{"id":"japanIncomeTax","country":"JP","region":"NATIONAL","calculator":"INCOME_TAX","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"JPY","currencySymbol":"¥","source":[{"name":"National Tax Agency Japan","url":"https://www.nta.go.jp"}]},"inputs":[{"name":"income","label":"ANNUAL_GROSS_INCOME","type":"number","required":true,"unit":"JPY","isCurrency":true}],"outputs":[],"rules":{"taxBrackets":[{"from":0,"to":1950000,"rate":0.05},{"from":1950000,"to":3300000,"rate":0.10},{"from":3300000,"to":6950000,"rate":0.20},{"from":6950000,"to":9000000,"rate":0.23},{"from":9000000,"to":18000000,"rate":0.33},{"from":18000000,"to":40000000,"rate":0.40},{"from":40000000,"to":null,"rate":0.45}],"inhabitantTax":{"rate":0.10}}}',
0, '2026', '', NULL);

-- Japan Corporate Tax
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('52d900d0-099d-48c6-8834-ef83e001ffd8', 'f0a9d3dc-287b-4c5d-96a3-2acc91974079', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b',
'{"meta":{"id":"japanCorporateTax","country":"JP","region":"NATIONAL","calculator":"CORPORATE_TAX","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"JPY","currencySymbol":"¥","source":[{"name":"National Tax Agency Japan","url":"https://www.nta.go.jp"}]},"inputs":[{"name":"taxableIncome","type":"number","required":true,"unit":"JPY","isCurrency":true,"label":"TAXABLE_INCOME"}],"outputs":[],"rules":{"regime":{"type":"flat","rate":0.2344}}}',
0, '2026', '', NULL);

-- Japan Mortgage
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('18892c51-79b9-424b-896d-f27ac635cfd6', 'bdfdeb6b-9497-410a-8d83-8d6bd572bde4', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b',
'{"meta":{"id":"japanMortgage","country":"JP","region":"NATIONAL","calculator":"MORTGAGE","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"JPY","currencySymbol":"¥","source":[{"name":"Financial Services Agency Japan","url":"https://www.fsa.go.jp"}]},"inputs":[{"type":"number","min":1,"isCurrency":true,"label":"PROPERTY_PRICE","name":"propertyPrice"},{"type":"number","min":0,"isCurrency":true,"label":"DOWN_PAYMENT","slider":{"max":50,"min":0,"step":1},"name":"downPayment"},{"type":"number","min":0,"label":"INTEREST_RATE","slider":{"max":10,"min":0.1,"step":0.1},"name":"interestRate"},{"type":"number","min":1,"label":"LOAN_DURATION","name":"amortizationYears"},{"type":"boolean","label":"IS_FIRST_TIME_BUYER","name":"isFirstTimeBuyer"}],"outputs":[],"rules":{"loanConstraints":{"maxLtvPercent":90,"maxAmortizationYears":35},"interest":{"compounding":"MONTHLY"},"acquisitionTax":{"rate":0.03}}}',
0, '2026', '', NULL);

-- Japan Capital Gains
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('dd3c312c-cd12-45e6-a4d5-eda181d0bea6', 'de10134b-ffab-4835-b608-592934b4331e', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b',
'{"meta":{"id":"jp-capital-gains","country":"JP","region":"NATIONAL","calculator":"CAPITAL_GAINS","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"JPY","currencySymbol":"¥","source":[{"name":"National Tax Agency Japan","url":"https://www.nta.go.jp"}]},"inputs":[{"name":"capitalGain","type":"number","required":true,"unit":"JPY","isCurrency":true,"label":"CAPITAL_GAIN"}],"outputs":[],"rules":{"flatRate":0.20315}}',
0, '2026', '', NULL);

-- Japan Inheritance Tax
INSERT INTO calculator_countries (ID, CalculatorTypeID, CountryID, JsonSchema, WithProvincial, Year, CreatedAt, DisabledAt) VALUES
('9a3d8e25-1a99-4b91-ab58-0e0420210933', '4ade4f6f-e9a7-431c-b4fc-22e81fc2ca4d', 'f0b2e6f0-1804-4485-9e70-7f0c26122e5b',
'{"meta":{"id":"jpInheritanceTax","country":"JP","region":"NATIONAL","calculator":"INHERITANCE_TAX","version":"2026.1","effectiveFrom":"2026-01-01","effectiveTo":null,"currency":"JPY","currencySymbol":"¥","source":[{"name":"National Tax Agency Japan","url":"https://www.nta.go.jp"}]},"inputs":[{"name":"estateValue","label":"ESTATE_VALUE","type":"number","required":true,"unit":"JPY","isCurrency":true},{"name":"numberOfStatutoryHeirs","label":"NUMBER_OF_HEIRS","type":"number","required":false,"default":1}],"outputs":[],"rules":{"baseExemption":30000000,"perHeirExemption":6000000,"taxBrackets":[{"from":0,"to":10000000,"rate":0.10},{"from":10000000,"to":30000000,"rate":0.15},{"from":30000000,"to":50000000,"rate":0.20},{"from":50000000,"to":100000000,"rate":0.30},{"from":100000000,"to":200000000,"rate":0.40},{"from":200000000,"to":300000000,"rate":0.45},{"from":300000000,"to":600000000,"rate":0.50},{"from":600000000,"to":null,"rate":0.55}]}}',
0, '2026', '', NULL);
