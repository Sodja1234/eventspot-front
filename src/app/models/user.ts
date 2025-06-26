import { Interet } from "./interet";
import { Organisateur } from "./organisateur";

// models/user.model.ts
export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'organisateur' | 'public';
  interests?: Interet[];
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  organisateur?: Organisateur;
}

export interface UserSearch{
  id: string;
  name: string;
  email: string;
  role: any;
  created_at: string;
}


