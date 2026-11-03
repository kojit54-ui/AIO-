/** 上限の範囲。行き過ぎた値は入れられない */
export const TRIAL_RANGES = {
  trial_daily_per_visitor: { min: 0, max: 20 },
  trial_daily_total: { min: 0, max: 1000 },
  trial_monthly_budget_yen: { min: 0, max: 50000 },
} as const;
