export interface Menu {
  id: number;
  description: string;
  name: string;
  slug: string;
  meta: any[];
  locations: any[];
  auto_add: boolean;
  _links: Record<string, any>;
}