import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, calculateTotals } from '../src/bitrix/direct-template-generator.js'

describe('Currency Formatting', () => {
  it('should format valid numbers in Vietnamese format', () => {
    expect(formatCurrency(1000)).toBe('1.000')
    expect(formatCurrency(1000000)).toBe('1.000.000')
    expect(formatCurrency(1234567.89)).toBe('1.234.568') // Rounded
  })

  it('should handle zero and negative numbers', () => {
    expect(formatCurrency(0)).toBe('0')
    expect(formatCurrency(-1000)).toBe('-1.000')
    expect(formatCurrency(-0)).toBe('0')
  })

  it('should handle invalid inputs gracefully', () => {
    expect(formatCurrency(NaN)).toBe('0')
    expect(formatCurrency('invalid')).toBe('0')
    expect(formatCurrency(null)).toBe('0')
    expect(formatCurrency(undefined)).toBe('0')
  })

  it('should handle very large numbers', () => {
    expect(formatCurrency(999999999)).toBe('999.999.999')
    expect(formatCurrency(1000000000)).toBe('1.000.000.000')
  })

  it('should round decimals properly', () => {
    expect(formatCurrency(1234.4)).toBe('1.234')
    expect(formatCurrency(1234.5)).toBe('1.235')
    expect(formatCurrency(1234.6)).toBe('1.235')
  })
})

describe('Date Formatting', () => {
  it('should format valid date strings', () => {
    expect(formatDate('2024-01-15')).toBe('15/01/2024')
    expect(formatDate('2024-12-31')).toBe('31/12/2024')
    expect(formatDate('2023-02-28')).toBe('28/02/2023')
  })

  it('should format Date objects', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    expect(formatDate(date)).toBe('15/01/2024')
  })

  it('should handle ISO date strings', () => {
    expect(formatDate('2024-01-15T10:30:00.000Z')).toBe('15/01/2024')
    expect(formatDate('2024-01-15T00:00:00Z')).toBe('15/01/2024')
  })

  it('should handle invalid dates gracefully', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('invalid-date')).toBe('')
    expect(formatDate('2024-13-40')).toBe('') // Invalid date
  })

  it('should format edge case dates', () => {
    expect(formatDate('2024-01-01')).toBe('01/01/2024') // New Year
    expect(formatDate('2024-02-29')).toBe('29/02/2024') // Leap year
    expect(formatDate('2023-02-28')).toBe('28/02/2023') // Non-leap year
  })

  it('should pad single digit dates and months', () => {
    expect(formatDate('2024-01-01')).toBe('01/01/2024')
    expect(formatDate('2024-01-09')).toBe('09/01/2024')
    expect(formatDate('2024-09-01')).toBe('01/09/2024')
  })
})

describe('Total Calculations', () => {
  it('should calculate totals for single product', () => {
    const products = [{
      QUANTITY: '2',
      PRICE_EXCLUSIVE: '100',
      DISCOUNT_SUM: '10', 
      TAX_RATE: '10'
    }]
    
    const result = calculateTotals(products)
    
    // (100 * 2) - (10 * 2) = 200 - 20 = 180 subtotal
    // 180 * 10% = 18 VAT
    // 180 + 18 = 198 grand total
    expect(result.subtotal).toBe(180)
    expect(result.vatAmount).toBe(18)
    expect(result.grandTotal).toBe(198)
  })

  it('should calculate totals for multiple products', () => {
    const products = [
      {
        QUANTITY: '1',
        PRICE_EXCLUSIVE: '100',
        DISCOUNT_SUM: '0',
        TAX_RATE: '10'
      },
      {
        QUANTITY: '2', 
        PRICE_EXCLUSIVE: '50',
        DISCOUNT_SUM: '5',
        TAX_RATE: '10'
      }
    ]
    
    const result = calculateTotals(products)
    
    // Product 1: (100 * 1) - (0 * 1) = 100, VAT = 10
    // Product 2: (50 * 2) - (5 * 2) = 100 - 10 = 90, VAT = 9  
    // Total: subtotal = 190, VAT = 19, grand total = 209
    expect(result.subtotal).toBe(190)
    expect(result.vatAmount).toBe(19)
    expect(result.grandTotal).toBe(209)
  })

  it('should handle products with no VAT', () => {
    const products = [{
      QUANTITY: '3',
      PRICE_EXCLUSIVE: '100',
      DISCOUNT_SUM: '0',
      TAX_RATE: '0'
    }]
    
    const result = calculateTotals(products)
    
    expect(result.subtotal).toBe(300)
    expect(result.vatAmount).toBe(0)
    expect(result.grandTotal).toBe(300)
  })

  it('should handle products with 100% discount', () => {
    const products = [{
      QUANTITY: '1',
      PRICE_EXCLUSIVE: '100',
      DISCOUNT_SUM: '100', // 100% discount
      TAX_RATE: '10'
    }]
    
    const result = calculateTotals(products)
    
    expect(result.subtotal).toBe(0)
    expect(result.vatAmount).toBe(0)
    expect(result.grandTotal).toBe(0)
  })

  it('should handle empty or invalid inputs', () => {
    expect(calculateTotals([])).toEqual({ subtotal: 0, vatAmount: 0, grandTotal: 0 })
    expect(calculateTotals(null)).toEqual({ subtotal: 0, vatAmount: 0, grandTotal: 0 })
    expect(calculateTotals(undefined)).toEqual({ subtotal: 0, vatAmount: 0, grandTotal: 0 })
  })

  it('should handle invalid product data gracefully', () => {
    const products = [{
      QUANTITY: 'invalid',
      PRICE_EXCLUSIVE: 'not-a-number',
      DISCOUNT_SUM: null,
      TAX_RATE: undefined
    }]
    
    const result = calculateTotals(products)
    
    // Should default to: quantity=1, price=0, discount=0, tax=0
    expect(result.subtotal).toBe(0)
    expect(result.vatAmount).toBe(0) 
    expect(result.grandTotal).toBe(0)
  })

  it('should fallback to PRICE when PRICE_EXCLUSIVE missing', () => {
    const products = [{
      QUANTITY: '2',
      PRICE: '50', // Using PRICE instead of PRICE_EXCLUSIVE
      DISCOUNT_SUM: '0',
      TAX_RATE: '10'
    }]
    
    const result = calculateTotals(products)
    
    // (50 * 2) - (0 * 2) = 100 subtotal
    // 100 * 10% = 10 VAT
    expect(result.subtotal).toBe(100)
    expect(result.vatAmount).toBe(10)
    expect(result.grandTotal).toBe(110)
  })

  it('should handle decimal calculations precisely', () => {
    const products = [{
      QUANTITY: '3',
      PRICE_EXCLUSIVE: '33.33',
      DISCOUNT_SUM: '3.33',
      TAX_RATE: '10'
    }]
    
    const result = calculateTotals(products)
    
    // (33.33 * 3) - (3.33 * 3) = 99.99 - 9.99 = 90
    // 90 * 10% = 9 VAT
    expect(result.subtotal).toBe(90)
    expect(result.vatAmount).toBe(9)
    expect(result.grandTotal).toBe(99)
  })
})