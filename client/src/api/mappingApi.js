import api from './axios';

export const getMappings = async () => {
  const response = await api.get('/mappings/');
  return response.data;
};

export const getPatientMappings = async (patientId) => {
  const response = await api.get(`/mappings/${patientId}/`);
  return response.data;
};

export const createMapping = async (mappingData) => {
  const response = await api.post('/mappings/', mappingData);
  return response.data;
};

export const deleteMapping = async (id) => {
  const response = await api.delete(`/mappings/${id}/`);
  return response.data;
};
