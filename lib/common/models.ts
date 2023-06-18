export interface HTTPError {
  status: number;
  message: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

export interface Pagination {
  first?: number;
  after?: string;
}