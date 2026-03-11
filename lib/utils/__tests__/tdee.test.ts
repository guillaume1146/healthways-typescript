import { describe, it, expect } from 'vitest'
import { calculateTdee, calculateTargetCalories } from '../tdee'

describe('TDEE Calculator', () => {
  describe('calculateTdee', () => {
    it('calculates BMR and TDEE for a male', () => {
      const result = calculateTdee({
        heightCm: 175,
        weightKg: 70,
        age: 30,
        gender: 'male',
        activityLevel: 'moderately_active',
      })
      // BMR = 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
      expect(result.bmr).toBe(1649)
      // TDEE = 1648.75 * 1.55 = 2555.5625
      expect(result.tdee).toBe(2556)
      // BMI = 70 / (1.75^2) = 22.9
      expect(result.bmi).toBe(22.9)
    })

    it('calculates BMR and TDEE for a female', () => {
      const result = calculateTdee({
        heightCm: 162,
        weightKg: 58,
        age: 28,
        gender: 'female',
        activityLevel: 'lightly_active',
      })
      // BMR = 10*58 + 6.25*162 - 5*28 - 161 = 580 + 1012.5 - 140 - 161 = 1291.5
      expect(result.bmr).toBe(1292)
      // TDEE = 1291.5 * 1.375 = 1775.8125
      expect(result.tdee).toBe(1776)
    })

    it('uses male formula for "other" gender', () => {
      const result = calculateTdee({
        heightCm: 170,
        weightKg: 65,
        age: 25,
        gender: 'other',
        activityLevel: 'sedentary',
      })
      // Should use male formula
      // BMR = 10*65 + 6.25*170 - 5*25 + 5 = 650 + 1062.5 - 125 + 5 = 1592.5
      expect(result.bmr).toBe(1593)
    })

    it('defaults to moderately_active multiplier for unknown activity level', () => {
      const result = calculateTdee({
        heightCm: 175,
        weightKg: 70,
        age: 30,
        gender: 'male',
        activityLevel: 'unknown_level',
      })
      // Should use 1.55 multiplier
      expect(result.tdee).toBe(Math.round(1648.75 * 1.55))
    })

    it('calculates BMI correctly', () => {
      const result = calculateTdee({
        heightCm: 180,
        weightKg: 90,
        age: 35,
        gender: 'male',
        activityLevel: 'sedentary',
      })
      // BMI = 90 / (1.8^2) = 27.8
      expect(result.bmi).toBe(27.8)
    })

    it('handles extra_active activity level', () => {
      const result = calculateTdee({
        heightCm: 175,
        weightKg: 70,
        age: 30,
        gender: 'male',
        activityLevel: 'extra_active',
      })
      expect(result.tdee).toBe(Math.round(1648.75 * 1.9))
    })
  })

  describe('calculateTargetCalories', () => {
    it('returns TDEE - 500 for weight loss', () => {
      expect(calculateTargetCalories(2000, 'lose')).toBe(1500)
    })

    it('enforces minimum 1200 calories for weight loss', () => {
      expect(calculateTargetCalories(1500, 'lose')).toBe(1200)
    })

    it('returns TDEE for maintain', () => {
      expect(calculateTargetCalories(2000, 'maintain')).toBe(2000)
    })

    it('returns TDEE + 300 for weight gain', () => {
      expect(calculateTargetCalories(2000, 'gain')).toBe(2300)
    })

    it('defaults to maintain for unknown goal', () => {
      expect(calculateTargetCalories(2000, 'something')).toBe(2000)
    })
  })
})
