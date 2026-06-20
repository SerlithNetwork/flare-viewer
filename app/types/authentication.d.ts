import type { IAudited } from "./audited";

export interface AuthenticationForm {}

export interface AuthenticationForm$Password extends AuthenticationForm {
  username: string;
  password: string;
}

export interface AuthenticationForm$Token extends AuthenticationForm {
  token: string;
}

export interface AuthenticationDetails {
  user: FlareManagerDetails$View;
  access: AuthenticationDetails$Entry;
  refresh: AuthenticationDetails$Entry;
}

export interface AuthenticationDetails$Entry {
  token: string;
  expiration: number;
}

export interface FlareManagerDetails {
  username: string;
}

export interface FlareManagerDetails$View
  extends FlareManagerDetails, IAudited {}

export interface FlareUserDetails {
  name: string;
  can_manage: boolean;
}

export interface FlareUserDetails$Request extends FlareUserDetails {}

export interface FlareUserDetails$Update extends FlareUserDetails {}

export interface FlareUserDetails$View extends FlareUserDetails, IAudited {
  token: string;
}
