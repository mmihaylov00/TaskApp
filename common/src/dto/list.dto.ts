import { UserDetailsDto } from './auth.dto';

export interface PageRequestDto {
  page: number;
  pageAmount: number;
}

export class Page<T> {
  items: T[];
  totalPages: number;

  constructor(data: { items: T[]; count: number; page: PageRequestDto }) {
    this.items = data.items;
    this.totalPages = Math.ceil(data.count / data.page.pageAmount);
  }

  public static async getPageData<Entity, T>(
    query: any,
    page: PageRequestDto,
    mapFunction: (entity: Entity) => T,
  ) {
    const [entityItems, count] = await query
      .skip((page.page - 1) * page.pageAmount)
      .take(page.pageAmount)
      .getManyAndCount();

    const items = entityItems.map(mapFunction);

    return new Page<T>({
      items,
      count,
      page,
    });
  }
}
