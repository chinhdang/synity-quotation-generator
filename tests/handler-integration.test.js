import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockBitrix24Client, createFailingBitrix24Client, mockCRMData } from './mocks/bitrix24-client.js'

// We'll mock the Bitrix24Client at the module level
vi.mock('../src/bitrix/client.js', () => ({
  Bitrix24Client: vi.fn()
}))

describe('Handler Integration Tests', () => {
  let mockEnv

  beforeEach(() => {
    mockEnv = {
      APP_NAME: 'Test Quotation App',
      APP_ENV: 'test',
      LOG_LEVEL: 'debug'
    }
    vi.clearAllMocks()
  })

  describe('Widget Quotation Handler', () => {
    it('should handle valid widget request with entity data', async () => {
      // Import after mocking to ensure mock is applied
      const { Bitrix24Client } = await import('../src/bitrix/client.js')
      const { widgetQuotationHandler } = await import('../src/bitrix/handlers.js')
      
      // Setup mock client
      const mockClient = createMockBitrix24Client()
      Bitrix24Client.mockReturnValue(mockClient)

      // Create mock request
      const request = new Request('https://example.com/widget/quotation', {
        method: 'POST',
        body: 'AUTH_ID=test-auth&DOMAIN=test.bitrix24.com&PLACEMENT_OPTIONS=' + 
              encodeURIComponent(JSON.stringify({ ID: '123' })) + '&PLACEMENT=CRM_DEAL_DETAIL_TAB'
      })

      const ctx = {}
      
      const response = await widgetQuotationHandler({ req: request, env: mockEnv, ctx })
      
      // Verify response
      expect(response).toBeInstanceOf(Response)
      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('text/html')
      
      // Verify client was created and called
      expect(Bitrix24Client).toHaveBeenCalledWith({
        access_token: 'test-auth',
        refresh_token: undefined,
        domain: 'test.bitrix24.com',
        member_id: undefined,
        client_endpoint: 'https://test.bitrix24.com/rest/'
      }, mockEnv)
      
      // Verify API calls were made
      expect(mockClient.call).toHaveBeenCalledWith('user.current')
      expect(mockClient.call).toHaveBeenCalledWith('crm.deal.get', { id: '123' })
    })

    it('should handle request without entity ID', async () => {
      const { Bitrix24Client } = await import('../src/bitrix/client.js')
      const { widgetQuotationHandler } = await import('../src/bitrix/handlers.js')
      
      const mockClient = createMockBitrix24Client()
      Bitrix24Client.mockReturnValue(mockClient)

      const request = new Request('https://example.com/widget/quotation', {
        method: 'POST',
        body: 'AUTH_ID=test-auth&DOMAIN=test.bitrix24.com&PLACEMENT=CRM_DEAL_LIST_TOOLBAR'
      })

      const response = await widgetQuotationHandler({ req: request, env: mockEnv, ctx: {} })
      
      expect(response.status).toBe(200)
      
      // With no entity ID in PLACEMENT_OPTIONS, should still generate interface
      // but without calling entity-specific APIs
      expect(mockClient.call).not.toHaveBeenCalledWith('crm.deal.get', expect.any(Object))
    })

    it('should handle missing auth data gracefully', async () => {
      const { widgetQuotationHandler } = await import('../src/bitrix/handlers.js')
      
      const request = new Request('https://example.com/widget/quotation', {
        method: 'POST',
        body: 'DOMAIN=test.bitrix24.com' // Missing AUTH_ID
      })

      const response = await widgetQuotationHandler({ req: request, env: mockEnv, ctx: {} })
      
      expect(response.status).toBe(400)
      expect(await response.text()).toContain('Missing authentication data')
    })

    it('should handle API errors gracefully', async () => {
      const { Bitrix24Client } = await import('../src/bitrix/client.js')
      const { widgetQuotationHandler } = await import('../src/bitrix/handlers.js')
      
      // Setup failing client
      const failingClient = createFailingBitrix24Client('Network timeout')
      Bitrix24Client.mockReturnValue(failingClient)

      const request = new Request('https://example.com/widget/quotation', {
        method: 'POST',
        body: 'AUTH_ID=test-auth&DOMAIN=test.bitrix24.com&PLACEMENT_OPTIONS=' + 
              encodeURIComponent(JSON.stringify({ ID: '123' }))
      })

      const response = await widgetQuotationHandler({ req: request, env: mockEnv, ctx: {} })
      
      // Should still return HTML (with empty data)
      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('text/html')
    })

    it('should extract entity type from placement correctly', async () => {
      const { Bitrix24Client } = await import('../src/bitrix/client.js')
      const { widgetQuotationHandler } = await import('../src/bitrix/handlers.js')
      
      // Test just one case to keep it simple
      const mockClient = createMockBitrix24Client()
      Bitrix24Client.mockReturnValue(mockClient)
        
      const request = new Request('https://example.com/widget/quotation', {
        method: 'POST', 
        body: `AUTH_ID=test-auth&DOMAIN=test.bitrix24.com&PLACEMENT=CRM_LEAD_DETAIL_TAB&PLACEMENT_OPTIONS=` + 
              encodeURIComponent(JSON.stringify({ ID: '123' }))
      })

      const response = await widgetQuotationHandler({ req: request, env: mockEnv, ctx: {} })
      
      expect(response.status).toBe(200)
      
      // Should call lead API
      expect(mockClient.call).toHaveBeenCalledWith('crm.lead.get', { id: '123' })
      
      // Should not call deal API
      expect(mockClient.call).not.toHaveBeenCalledWith('crm.deal.get', expect.any(Object))
    })
  })

  describe('fetchCRMEntityData function', () => {
    it('should fetch complete CRM data for deal entity', async () => {
      // This test requires importing the function directly
      // Since it's not exported, we'll test it through the handler
      const { Bitrix24Client } = await import('../src/bitrix/client.js')
      const { widgetQuotationHandler } = await import('../src/bitrix/handlers.js')
      
      const mockClient = createMockBitrix24Client()
      Bitrix24Client.mockReturnValue(mockClient)

      const request = new Request('https://example.com/widget/quotation', {
        method: 'POST',
        body: 'AUTH_ID=test-auth&DOMAIN=test.bitrix24.com&PLACEMENT=CRM_DEAL_DETAIL_TAB&PLACEMENT_OPTIONS=' + 
              encodeURIComponent(JSON.stringify({ ID: '123' }))
      })

      await widgetQuotationHandler({ req: request, env: mockEnv, ctx: {} })
      
      // Verify all expected API calls were made
      expect(mockClient.call).toHaveBeenCalledWith('user.current')
      expect(mockClient.call).toHaveBeenCalledWith('crm.deal.get', { id: '123' })
      expect(mockClient.call).toHaveBeenCalledWith('user.get', { ID: '2' })
      expect(mockClient.call).toHaveBeenCalledWith('crm.company.get', { id: '456' })
      expect(mockClient.call).toHaveBeenCalledWith('crm.contact.get', { id: '789' })
    })

    it('should handle missing company and contact gracefully', async () => {
      const { Bitrix24Client } = await import('../src/bitrix/client.js')
      const { widgetQuotationHandler } = await import('../src/bitrix/handlers.js')
      
      // Mock deal without company/contact
      const customMockData = {
        ...mockCRMData,
        deal: {
          get: {
            result: {
              ID: '123',
              TITLE: 'Test Deal',
              ASSIGNED_BY_ID: '2',
              // No COMPANY_ID or CONTACT_ID
              OPPORTUNITY: '1000000',
              CURRENCY_ID: 'VND'
            }
          }
        }
      }
      
      const mockClient = createMockBitrix24Client(customMockData)
      Bitrix24Client.mockReturnValue(mockClient)

      const request = new Request('https://example.com/widget/quotation', {
        method: 'POST',
        body: 'AUTH_ID=test-auth&DOMAIN=test.bitrix24.com&PLACEMENT=CRM_DEAL_DETAIL_TAB&PLACEMENT_OPTIONS=' + 
              encodeURIComponent(JSON.stringify({ ID: '123' }))
      })

      const response = await widgetQuotationHandler({ req: request, env: mockEnv, ctx: {} })
      
      expect(response.status).toBe(200)
      
      // Should not call company/contact APIs
      expect(mockClient.call).not.toHaveBeenCalledWith('crm.company.get', expect.any(Object))
      expect(mockClient.call).not.toHaveBeenCalledWith('crm.contact.get', expect.any(Object))
    })
  })
})