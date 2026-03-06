import { CalculatorType as BaseCalculatorType } from '@novha/calc-engines';

export const CalculatorType = {
	...BaseCalculatorType,
	CAPITAL_GAIN_TAX: 'CAPITAL_GAIN_TAX',
} as const;

export type CalculatorType = (typeof CalculatorType)[keyof typeof CalculatorType];
