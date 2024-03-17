import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { ColumnDto } from './dtos/column.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table[header][columns][data]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input('header') header: string;
  @Input('page') page?: PageRequestDto;
  @Input('skeletonRows') skeletonRows: number = 5;
  @Input('columns') columns: ColumnDto[];
  @Input('data') data: any[] | Page<any>;
  @Input('loading') loading: boolean;
  @Output() changePage = new EventEmitter<number>();
  @ContentChild('row')
  row: TemplateRef<any>;

  getColumns() {
    return this.columns.flatMap((value) => value.key);
  }

  pageClick(page: PageEvent) {
    this.changePage.emit(page.pageIndex + 1);
  }

  items() {
    return (this.data as Page<any>)?.totalCount
      ? (this.data as Page<any>).items
      : (this.data as any[]);
  }
}
