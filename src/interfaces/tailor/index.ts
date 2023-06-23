import { GarmentInterface } from 'interfaces/garment';
import { OrderInterface } from 'interfaces/order';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TailorInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  garment?: GarmentInterface[];
  order?: OrderInterface[];
  user?: UserInterface;
  _count?: {
    garment?: number;
    order?: number;
  };
}

export interface TailorGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
