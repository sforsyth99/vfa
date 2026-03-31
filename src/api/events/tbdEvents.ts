export interface TbdEvents {
  id: string;
  title: string;
  date?: string;
  description?: string;
  eventbriteUrl?: string;
  featured?: boolean;
  format: 'in-person' | 'online';
  location?: {
    indigenous?: string;
    english?: string;
  };
}

