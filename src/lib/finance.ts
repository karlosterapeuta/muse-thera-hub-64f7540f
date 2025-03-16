
interface TaxResult {
  taxableIncome: number;
  incomeTax: number;
  effectiveTaxRate: number;
}

export function calculateIncomeTax(
  grossIncome: number,
  socialSecurity: number,
  healthInsurance: number,
  educationExpenses: number,
  pensionPayments: number,
  privateRetirement: number = 0
): TaxResult {
  // Calculate annual values
  const annualGrossIncome = grossIncome * 12;
  const annualSocialSecurity = socialSecurity * 12;
  const annualHealthInsurance = healthInsurance * 12;
  const annualPensionPayments = pensionPayments * 12;
  const annualPrivateRetirement = privateRetirement * 12;

  // Calculate total deductions
  // Maximum education expenses deduction is R$ 3,561.50 per year (2023 value)
  const maxEducationDeduction = 3561.50;
  const educationDeduction = Math.min(educationExpenses, maxEducationDeduction);

  const totalDeductions = 
    annualSocialSecurity + 
    annualHealthInsurance + 
    educationDeduction + 
    annualPensionPayments + 
    annualPrivateRetirement;

  // Calculate taxable income
  const taxableIncome = Math.max(0, annualGrossIncome - totalDeductions) / 12;

  // Apply tax brackets (monthly values - 2023)
  let incomeTax = 0;
  const annualTaxableIncome = taxableIncome * 12;

  if (taxableIncome <= 1903.98) {
    incomeTax = 0;
  } else if (taxableIncome <= 2826.65) {
    incomeTax = (taxableIncome - 1903.98) * 0.075;
  } else if (taxableIncome <= 3751.05) {
    incomeTax = (2826.65 - 1903.98) * 0.075 + (taxableIncome - 2826.65) * 0.15;
  } else if (taxableIncome <= 4664.68) {
    incomeTax = (2826.65 - 1903.98) * 0.075 + (3751.05 - 2826.65) * 0.15 + (taxableIncome - 3751.05) * 0.225;
  } else {
    incomeTax = (2826.65 - 1903.98) * 0.075 + (3751.05 - 2826.65) * 0.15 + (4664.68 - 3751.05) * 0.225 + (taxableIncome - 4664.68) * 0.275;
  }

  // Calculate effective tax rate
  const effectiveTaxRate = taxableIncome > 0 ? (incomeTax / taxableIncome) * 100 : 0;

  return {
    taxableIncome,
    incomeTax,
    effectiveTaxRate
  };
}
