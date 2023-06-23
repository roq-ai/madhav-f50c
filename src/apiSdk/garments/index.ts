import axios from 'axios';
import queryString from 'query-string';
import { GarmentInterface, GarmentGetQueryInterface } from 'interfaces/garment';
import { GetQueryInterface } from '../../interfaces';

export const getGarments = async (query?: GarmentGetQueryInterface) => {
  const response = await axios.get(`/api/garments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGarment = async (garment: GarmentInterface) => {
  const response = await axios.post('/api/garments', garment);
  return response.data;
};

export const updateGarmentById = async (id: string, garment: GarmentInterface) => {
  const response = await axios.put(`/api/garments/${id}`, garment);
  return response.data;
};

export const getGarmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/garments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGarmentById = async (id: string) => {
  const response = await axios.delete(`/api/garments/${id}`);
  return response.data;
};
