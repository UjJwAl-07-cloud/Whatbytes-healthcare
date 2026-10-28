import api from './axios';

export const getDoctors = async () => {
  const response = await api.get('/doctors/');
  return response.data;
};

export const getDoctor = async (id) => {
  const response = await api.get(`/doctors/${id}/`);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post('/doctors/', doctorData);
  return response.data;
};

export const updateDoctor = async (id, doctorData) => {
  const response = await api.put(`/doctors/${id}/`, doctorData);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await api.delete(`/doctors/${id}/`);
  return response.data;
};
