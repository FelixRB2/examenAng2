import { Iemployee } from "./iemployee"

export interface IApiEmployees {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: Iemployee[];
}
