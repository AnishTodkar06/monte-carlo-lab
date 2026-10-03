export interface SimRow {
  sample_size: number;
  empirical: number;
  abs_error: number;
  pct_error: number;
  // Optional extra fields for specific problems (e.g. heads/tails, wins/losses)
  [key: string]: any;
}

export interface BaseSimResponse {
  experiment: string;
  theoretical: number;
  results: SimRow[];
}