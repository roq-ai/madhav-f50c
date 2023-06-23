import { TailorInterface } from 'interfaces/tailor';
import { GetQueryInterface } from 'interfaces';

export interface GarmentInterface {
  id?: string;
  type: string;
  tailor_id: string;
  created_at?: any;
  updated_at?: any;

  tailor?: TailorInterface;
  _count?: {};
}

export interface GarmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  type?: string;
  tailor_id?: string;
}
