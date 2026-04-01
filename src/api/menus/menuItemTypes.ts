export interface MenuItem {
  id: number;
  order: number;
  parent: number;
  title: { rendered: string };
  url: string;
  attr_title?: string;
  description?: string;
  type: string;
  object: string;
  object_id: number;
  classes: string[];
  xfn: string[];
  target?: string;
  _links: Record<string, any>;
}
