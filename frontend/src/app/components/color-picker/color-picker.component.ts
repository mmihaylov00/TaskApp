import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
  @Input() colors = [];
  @Input() defaultColor: string = '';
  @Output() onChange = new EventEmitter<string>();
  selectedColor: string;

  ngOnInit() {
    this.selectedColor = this.defaultColor || this.colors[0];
  }

  change(color) {
    this.onChange.emit(color);
  }
}
