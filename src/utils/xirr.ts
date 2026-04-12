/**
 * XIRR calculation using Newton-Raphson method.
 * cashFlows: array of { amount, date } where date is a Date object.
 */

interface CashFlow {
  amount: number;
  date: Date;
}

function daysBetween(d1: Date, d2: Date): number {
  return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
}

function npv(rate: number, flows: CashFlow[], d0: Date): number {
  let total = 0;
  for (const cf of flows) {
    const years = daysBetween(d0, cf.date) / 365.0;
    total += cf.amount / Math.pow(1 + rate, years);
  }
  return total;
}

function dnpv(rate: number, flows: CashFlow[], d0: Date): number {
  let total = 0;
  for (const cf of flows) {
    const years = daysBetween(d0, cf.date) / 365.0;
    if (years === 0) continue;
    total -= (years * cf.amount) / Math.pow(1 + rate, years + 1);
  }
  return total;
}

export function xirr(cashFlows: CashFlow[], guess: number = 0.1): number {
  if (cashFlows.length < 2) return 0;

  const d0 = cashFlows[0].date;

  // Check that there's at least one negative and one positive flow
  const hasNeg = cashFlows.some(cf => cf.amount < 0);
  const hasPos = cashFlows.some(cf => cf.amount > 0);
  if (!hasNeg || !hasPos) return 0;

  let rate = guess;
  const maxIter = 200;
  const tolerance = 1e-8;

  for (let i = 0; i < maxIter; i++) {
    const f = npv(rate, cashFlows, d0);
    const df = dnpv(rate, cashFlows, d0);

    if (Math.abs(df) < 1e-14) break;

    const newRate = rate - f / df;

    // Clamp to prevent divergence
    if (newRate < -0.99) {
      rate = (rate + -0.99) / 2;
    } else if (newRate > 10) {
      rate = (rate + 10) / 2;
    } else {
      rate = newRate;
    }

    if (Math.abs(f) < tolerance) return rate;
  }

  return rate;
}

/**
 * Convenience: compute XIRR from monthly cash flows starting at a base date.
 */
export function xirrFromMonthly(monthlyCashFlows: number[]): number {
  const baseDate = new Date(2025, 0, 1); // Jan 1, 2025
  const flows: CashFlow[] = monthlyCashFlows
    .map((amount, i) => ({
      amount,
      date: new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1),
    }))
    .filter(cf => cf.amount !== 0);

  if (flows.length < 2) return 0;
  return xirr(flows);
}
