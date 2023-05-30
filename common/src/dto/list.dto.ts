export interface PageRequestDto {
  page: number;
  pageAmount: number;
}

export class Page<T> {
  items: T[];
  totalPages: number;

  constructor(data: {items: T[], count: number, page: PageRequestDto}) {
    this.items = data.items;
    this.totalPages = Math.ceil(data.count / data.page.pageAmount);
  }

}
