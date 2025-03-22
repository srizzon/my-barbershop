import { eUserStatus } from '../enums/user-status.enum';

export interface iUser {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  avatar_url: string;
  status: eUserStatus;
}
