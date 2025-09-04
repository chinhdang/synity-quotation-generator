import { vi } from 'vitest'

// Mock data for testing
export const mockCRMData = {
  user: {
    current: {
      result: {
        ID: '1',
        NAME: 'John',
        LAST_NAME: 'Doe',
        EMAIL: 'john.doe@company.com',
        WORK_PHONE: '+84-123-456-789'
      }
    }
  },
  
  deal: {
    get: {
      result: {
        ID: '123',
        TITLE: 'Test Deal',
        ASSIGNED_BY_ID: '2',
        COMPANY_ID: '456',
        CONTACT_ID: '789',
        OPPORTUNITY: '1000000',
        DISCOUNT_AMOUNT: '100000',
        TAX_VALUE: '90000',
        CURRENCY_ID: 'VND'
      }
    }
  },
  
  company: {
    get: {
      result: {
        ID: '456',
        TITLE: 'ACME Corporation',
        UF_CRM_TAX_ID: '0123456789',
        ADDRESS: '123 Business Street, District 1, Ho Chi Minh City'
      }
    }
  },
  
  contact: {
    get: {
      result: {
        ID: '789',
        NAME: 'Jane',
        LAST_NAME: 'Smith',
        PHONE: [{ VALUE: '+84-987-654-321' }],
        EMAIL: [{ VALUE: 'jane.smith@acme.com' }]
      }
    }
  },
  
  user: {
    get: {
      result: [{
        ID: '2',
        NAME: 'Sales',
        LAST_NAME: 'Manager',
        EMAIL: 'sales@company.com',
        WORK_PHONE: '+84-111-222-333'
      }]
    }
  },
  
  products: []
}

// Create mock Bitrix24Client class
export function createMockBitrix24Client(customResponses = {}) {
  const responses = { ...mockCRMData, ...customResponses }
  
  return {
    call: vi.fn().mockImplementation((method, params = {}) => {
      console.log(`Mock API call: ${method}`, params)
      
      switch (method) {
        case 'user.current':
          return Promise.resolve(responses.user?.current || { result: null })
          
        case 'user.get':
          return Promise.resolve(responses.user?.get || { result: [] })
          
        case 'crm.deal.get':
          if (params.id === '123') {
            return Promise.resolve(responses.deal?.get || { result: null })
          }
          return Promise.resolve({ result: null })
          
        case 'crm.company.get':
          if (params.id === '456') {
            return Promise.resolve(responses.company?.get || { result: null })
          }
          return Promise.resolve({ result: null })
          
        case 'crm.contact.get':
          if (params.id === '789') {
            return Promise.resolve(responses.contact?.get || { result: null })
          }
          return Promise.resolve({ result: null })
          
        case 'crm.lead.get':
          return Promise.resolve(responses.lead?.get || { result: null })
          
        case 'crm.item.get':
          return Promise.resolve(responses.invoice?.get || { result: null })
          
        case 'crm.estimate.get':
          return Promise.resolve(responses.estimate?.get || { result: null })
          
        case 'crm.requisite.list':
          return Promise.resolve({ result: [] })
          
        case 'crm.address.list':
          return Promise.resolve({ result: [] })
          
        case 'crm.item.productrow.list':
          return Promise.resolve({ result: responses.products || [] })
          
        default:
          console.warn(`Unmocked API call: ${method}`)
          return Promise.resolve({ result: null })
      }
    }),
    
    callBatch: vi.fn().mockResolvedValue({ result: [] }),
    
    // Add other client methods as needed
    saveSettings: vi.fn().mockResolvedValue(true),
    isConfigured: vi.fn().mockReturnValue(true)
  }
}

// Helper to create failing client
export function createFailingBitrix24Client(errorMessage = 'API Error') {
  return {
    call: vi.fn().mockRejectedValue(new Error(errorMessage)),
    callBatch: vi.fn().mockRejectedValue(new Error(errorMessage)),
    saveSettings: vi.fn().mockResolvedValue(true),
    isConfigured: vi.fn().mockReturnValue(true)
  }
}