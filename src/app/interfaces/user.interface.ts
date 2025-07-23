export interface User {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  password: string;
  role: {
    id: number;
    name: string;
  };
  enabled: boolean;
  authorities: any[];
  username: string;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}
