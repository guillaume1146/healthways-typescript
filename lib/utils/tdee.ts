/**
 * TDEE (Total Daily Energy Expenditure) calculator using Mifflin-St Jeor equation.
 */

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
}

export interface TdeeInput {
  heightCm: number
  weightKg: number
  age: number
  gender: string // 'male' | 'female' | 'other'
  activityLevel: string
}

export interface TdeeResult {
  bmr: number
  tdee: number
  bmi: number
}

/**
 * Calculate BMR using Mifflin-St Jeor equation.
 * Male: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 5 + 161
 * Female: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
 */
export function calculateTdee(input: TdeeInput): TdeeResult {
  const { heightCm, weightKg, age, gender, activityLevel } = input

  // BMR calculation (Mifflin-St Jeor)
  let bmr: number
  if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  } else {
    // male or other defaults to male formula
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  }

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderately_active
  const tdee = Math.round(bmr * multiplier)

  // BMI
  const heightM = heightCm / 100
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10

  return { bmr: Math.round(bmr), tdee, bmi }
}

/**
 * Calculate target calories based on weight goal.
 * lose: TDEE - 500 (roughly 0.5kg/week loss)
 * maintain: TDEE
 * gain: TDEE + 300
 */
export function calculateTargetCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'lose': return Math.max(1200, tdee - 500)
    case 'gain': return tdee + 300
    default: return tdee
  }
}
