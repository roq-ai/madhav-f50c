import { UserInterface } from 'interfaces/user';
import { TailorInterface } from 'interfaces/tailor';
import { GetQueryInterface } from 'interfaces';

export interface OrderInterface {
  id?: string;
  status: string;
  customer_id: string;
  tailor_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  tailor?: TailorInterface;
  _count?: {};
}

export interface OrderGetQueryInterface extends GetQueryInterface {
  id?: string;
  status?: string;
  customer_id?: string;
  tailor_id?: string;
}
