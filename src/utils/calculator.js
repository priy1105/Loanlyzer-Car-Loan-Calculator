// src/utils/calculator.js

/**
 * Calculates the Equated Monthly Installment (EMI) and the full amortization schedule.
 * This uses the reducing-balance method for calculation. [1, 2]
 * @param {number} principal - The total loan amount.
 * @param {number} annualRate - The annual interest rate (e.g., 8.5 for 8.5%).
 * @param {number} tenureYears - The loan term in years.
 * @returns {object | null} An object containing the monthly EMI, total interest, total payment, and the schedule, or null if inputs are invalid.
 */
export const calculateAmortization = (principal, annualRate, tenureYears) => {
  const monthlyRate = annualRate / 12 / 100;
  const tenureMonths = tenureYears * 12;

  // Corrected validation check for input values using the logical OR '||' operator.
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return null;
  }

  // Calculate EMI using the standard formula [1, 3]
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  let remainingBalance = principal;
  let totalInterest = 0;
  const amortizationSchedule =[]; // Correctly initialized as an empty array
  const startDate = new Date();

  // Generate the schedule for each month [2, 4]
  for (let i = 1; i <= tenureMonths; i++) {
    const interestForMonth = remainingBalance * monthlyRate;
    const principalForMonth = emi - interestForMonth;
    remainingBalance -= principalForMonth;
    totalInterest += interestForMonth;

    // To prevent a negative balance in the last month due to floating-point inaccuracies
    if (i === tenureMonths) {
        remainingBalance = 0;
    }

    const paymentDate = new Date(startDate);
    paymentDate.setMonth(startDate.getMonth() + i);

    amortizationSchedule.push({
      paymentNumber: i,
      paymentDate: paymentDate.toLocaleDateString(),
      emi: parseFloat(emi.toFixed(2)),
      principal: parseFloat(principalForMonth.toFixed(2)),
      interest: parseFloat(interestForMonth.toFixed(2)),
      remainingBalance: parseFloat(remainingBalance.toFixed(2)),
    });
  }

  return {
    monthlyEmi: parseFloat(emi.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalPayable: parseFloat((emi * tenureMonths).toFixed(2)),
    amortizationSchedule,
  };
};