import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card[header]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input('header') header: string;
}
