import { Component, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PopupData, setProfileOpenState } from '../../states/popup.reducer';

@Component({
  selector: 'app-popup[name]',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  @Input() name: string;
  @Input() additionalClasses: string;
  dropdownVisible = false;

  constructor(private readonly store: Store) {
    this.store
      .pipe(select((value: any) => value.popupData))
      .subscribe((value: PopupData) => {
        if (value[this.name]) {
          this.openMenu();
        }
      });
  }

  closeClick() {
    this.dropdownVisible = false;
    this.store.dispatch(setProfileOpenState({ isOpen: false }));
  }

  openMenu() {
    setTimeout(() => (this.dropdownVisible = true), 1);
    setTimeout(() => {
      document.addEventListener('click', this.closeClick.bind(this), {
        once: true,
      });
    }, 100);
  }
}
