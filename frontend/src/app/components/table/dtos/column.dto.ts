export interface ColumnDto {
  key: string;
  header: string;
  type: 'text' | 'color' | 'slot';
  width?: 25 | 50 | 75;
}
