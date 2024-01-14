export type MaterialDescriptor = {
  type: 'Circle' | 'Line' | 'Lit' | 'Trajectory';

  cullMode?: 'back' | 'none',

  texture?: string,

  color?: number[],
}
