import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email, password) => 
    api.post('/auth/register', { email, password }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  
  getById: (id) => api.get(`/projects/${id}`),
  
  create: (projectData) => api.post('/projects', projectData),
  
  delete: (id) => api.delete(`/projects/${id}`),
  
  generateContent: (id, sectionId = null) => 
    api.post(`/projects/${id}/generate`, { section_id: sectionId }),
  
  refineContent: (id, sectionId, prompt) => 
    api.post(`/projects/${id}/refine`, { section_id: sectionId, prompt }),
  
  submitFeedback: (id, sectionId, feedbackType, comment = null) => 
    api.post(`/projects/${id}/feedback`, { 
      section_id: sectionId, 
      feedback_type: feedbackType, 
      comment 
    }),
  
  export: (id) => 
    api.get(`/projects/${id}/export`, { responseType: 'blob' }),
};

// AI Template API
export const aiAPI = {
  generateTemplate: (documentType, mainTopic, numSections = null) => 
    api.post('/ai/generate-template', { 
      document_type: documentType, 
      main_topic: mainTopic, 
      num_sections: numSections 
    }),
};

export default api;
