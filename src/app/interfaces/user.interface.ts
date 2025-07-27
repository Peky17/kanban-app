export interface User {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  password: string;
  won: string;
  employeeNumber: string;
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
