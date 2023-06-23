import axios from 'axios';
import queryString from 'query-string';
import { TailorInterface, TailorGetQueryInterface } from 'interfaces/tailor';
import { GetQueryInterface } from '../../interfaces';

export const getTailors = async (query?: TailorGetQueryInterface) => {
  const response = await axios.get(`/api/tailors${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTailor = async (tailor: TailorInterface) => {
  const response = await axios.post('/api/tailors', tailor);
  return response.data;
};

export const updateTailorById = async (id: string, tailor: TailorInterface) => {
  const response = await axios.put(`/api/tailors/${id}`, tailor);
  return response.data;
};

export const getTailorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/tailors/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTailorById = async (id: string) => {
  const response = await axios.delete(`/api/tailors/${id}`);
  return response.data;
};
