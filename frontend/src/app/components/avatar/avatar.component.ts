import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar[username]',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() url?: string;
  @Input() username: string;

  ngOnInit(): void {}
}
