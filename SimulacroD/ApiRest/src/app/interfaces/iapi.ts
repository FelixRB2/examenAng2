import { Iusuario } from "./iusuario";

export interface Iapi {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
      results: Iusuario[];
    }

