export interface PageRequestDto {
  page: number;
  pageAmount: number;
}

export class Page<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;

  constructor(data: { items: T[]; count: number; page: PageRequestDto }) {
    this.items = data.items;
    this.totalCount = data.count;
    this.currentPage = data.page.page;
    this.totalPages = Math.ceil(data.count / data.page.pageAmount);
  }

  public static urlParams(page: PageRequestDto) {
    return `pageAmount=${page.pageAmount}&page=${page.page}`;
  }

  public static paged(query: any, page: PageRequestDto) {
    return Object.assign(query, {
      limit: page.pageAmount,
      offset: (page.page - 1) * page.pageAmount,
    });
  }

  public static async getPageData<Entity, T>(
    data: Entity[],
    page: PageRequestDto,
    count: number,
    mapFunction: (entity: Entity) => T,
  ) {
    const items = data.map(mapFunction);

    return new Page<T>({
      items,
      count,
      page,
    });
  }
}
