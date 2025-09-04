import { describe, it, expect } from 'vitest'
import { generateQuotationNumber } from '../src/bitrix/direct-template-generator.js'

describe('Quotation Number Generation', () => {
  it('should generate quotation numbers for different entity types', () => {
    expect(generateQuotationNumber('lead', '123')).toBe('BXL-123')
    expect(generateQuotationNumber('deal', '456')).toBe('BXD-456')
    expect(generateQuotationNumber('invoice', '789')).toBe('BXSI-789')
    expect(generateQuotationNumber('estimate', '101')).toBe('BXE-101')
    expect(generateQuotationNumber('company', '202')).toBe('BXCO-202')
    expect(generateQuotationNumber('contact', '303')).toBe('BXC-303')
  })

  it('should handle unknown entity types', () => {
    expect(generateQuotationNumber('unknown', '999')).toBe('BXUNK-999')
    expect(generateQuotationNumber('custom', '888')).toBe('BXUNK-888')
    expect(generateQuotationNumber('', '777')).toBe('BXUNK-777')
  })

  it('should handle various entity ID formats', () => {
    expect(generateQuotationNumber('deal', 123)).toBe('BXD-123') // Number
    expect(generateQuotationNumber('deal', '0')).toBe('BXD-0') // Zero as string
    expect(generateQuotationNumber('deal', 0)).toBe('BXD-0') // Zero as number
  })

  it('should handle null and undefined inputs', () => {
    expect(generateQuotationNumber(null, '123')).toBe('BXUNK-123')
    expect(generateQuotationNumber(undefined, '123')).toBe('BXUNK-123')
    expect(generateQuotationNumber('deal', null)).toBe('BXD-null')
    expect(generateQuotationNumber('deal', undefined)).toBe('BXD-undefined')
  })

  it('should be case sensitive for entity types', () => {
    expect(generateQuotationNumber('DEAL', '123')).toBe('BXUNK-123') // Uppercase
    expect(generateQuotationNumber('Deal', '123')).toBe('BXUNK-123') // Title case
    expect(generateQuotationNumber('deal', '123')).toBe('BXD-123') // Lowercase (correct)
  })
})