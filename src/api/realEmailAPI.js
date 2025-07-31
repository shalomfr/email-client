// Real Email API - מחליף את MockAPI עבור מיילים אמיתיים

const API_URL = 'http://localhost:3001/api';

// Helper to get session ID from localStorage
const getSessionId = () => localStorage.getItem('emailSessionId');

// Helper for API calls
const apiCall = async (url, options = {}) => {
  const sessionId = getSessionId();
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': sessionId || '',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'שגיאה בשרת');
  }
  
  return response.json();
};

// Email API
export const Email = {
  list: async () => {
    // In real implementation, we'll fetch from all folders
    return apiCall('/emails/inbox');
  },
  
  filter: async (conditions) => {
    const folder = conditions.folder || 'inbox';
    return apiCall(`/emails/${folder}`);
  },
  
  create: async (emailData) => {
    return apiCall('/emails/send', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  },
  
  update: async (id, updateData) => {
    return apiCall(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },
  
  delete: async (id) => {
    // Move to trash folder
    return apiCall(`/emails/${id}`, {
      method: 'DELETE'
    });
  }
};

// Account API for login/settings
export const Account = {
  login: async (credentials) => {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (result.success && result.sessionId) {
      localStorage.setItem('emailSessionId', result.sessionId);
      if (credentials.email || credentials.email_address) {
        localStorage.setItem('emailAccount', credentials.email || credentials.email_address);
      }
    }
    
    return result;
  },
  
  logout: async () => {
    localStorage.removeItem('emailSessionId');
    localStorage.removeItem('emailAccount');
    localStorage.removeItem('emailSettings');
  },
  
  list: async () => {
    const email = localStorage.getItem('emailAccount');
    const settings = localStorage.getItem('emailSettings');
    if (!email && !settings) return [];
    
    // Return saved account info
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        return [{ id: '1', ...parsed }];
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    
    return [{
      id: '1',
      email_address: email,
    }];
  },
  
  update: async (id, data) => {
    // Save all settings to localStorage
    localStorage.setItem('emailSettings', JSON.stringify(data));
    if (data.email_address) {
      localStorage.setItem('emailAccount', data.email_address);
    }
    return { ...data, id };
  }
};

// Keep mock data for other features (contacts, tasks, etc.)
export { Contact, Task, Rule, Template, Label } from '../components/MockAPI';