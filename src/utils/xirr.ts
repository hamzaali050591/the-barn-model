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
  if (cashFlows.length < 2) return NaN;

  const d0 = cashFlows[0].date;

  // XIRR is undefined unless there's at least one positive AND one negative flow.
  const hasNeg = cashFlows.some(cf => cf.amount < 0);
  const hasPos = cashFlows.some(cf => cf.amount > 0);
  if (!hasNeg || !hasPos) return NaN;

  let rate = guess;
  const maxIter = 200;
  const tolerance = 1e-8;

  for (let i = 0; i < maxIter; i++) {
    const f = npv(rate, cashFlows, d0);
    if (Math.abs(f) < tolerance) return rate;

    const df = dnpv(rate, cashFlows, d0);
    if (Math.abs(df) < 1e-14) break;

    const newRate = rate - f / df;

    if (newRate < -0.99) {
      rate = (rate + -0.99) / 2;
    } else if (newRate > 10) {
      rate = (rate + 10) / 2;
    } else {
      rate = newRate;
    }
  }

  // Did not converge. Confirm by checking residual NPV at the final rate.
  // Returning NaN here is intentional — the UI's fmtPct surfaces "—" rather
  // than the misleading clamp-ceiling rate (10.0 = 1000%) that this loop
  // would otherwise return for genuinely-broken cash-flow profiles.
  return Math.abs(npv(rate, cashFlows, d0)) < tolerance * 1000 ? rate : NaN;
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
