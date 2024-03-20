export interface ColumnDto {
  key: string;
  header: string;
  type: 'text' | 'color' | 'slot' | 'chip' | 'length';
  colors?: any;
  width?: 5 | 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 100;
}
