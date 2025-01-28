export interface Tile {
  letter: string;
  value: number;
  id: string;
}

export type BoardCell = {
  tile: Tile | null;
  multiplier?: 'DW' | 'TW' | 'DL' | 'TL';
};

export type Position = {
  row: number;
  col: number;
};