import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-icon-select[color]',
  templateUrl: './icon-select.component.html',
  styleUrls: ['./icon-select.component.scss'],
})
export class IconSelectComponent implements OnInit {
  @Input('color') color: string;
  readonly icons = [
    'check_box_outline_blank',
    'radio_button_unchecked',
    'change_history',
    'bar_chart',
    'favorite',
    'grade',
    'stars',
    'schedule',
    'label',
    'api',
    'grid_view',
    'widgets',
    'description',
    'military_tech',
    'person',
    'mood',
    'work',
    'workspaces',
    'public',
    'diamond',
    'sunny',
    'flash_on',
    'pets',
    'hive',
    'rocket',
    'cookie',
    'date_range',
    'build',
    'code',
    'html',
    'css',
    'javascript',
  ];
  iconControl = new FormControl(this.icons[0], []);

  latestValue = this.iconControl.value;

  ngOnInit() {
    this.iconControl.valueChanges.subscribe((value) => {
      if (!value) {
        this.iconControl.setValue(this.latestValue);
      } else {
        this.latestValue = value;
      }
    });
  }
}
