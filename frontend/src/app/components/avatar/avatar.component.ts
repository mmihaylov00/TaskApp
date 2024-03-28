import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar[username]',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() url?: string;
  @Input() username: string;
}
