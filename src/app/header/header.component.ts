import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="header-6">
      <div class="branding">
        <a routerLink="/" class="nav-link">
          <clr-icon shape="home"></clr-icon>
          <span class="title">Reactive Roomz</span>
        </a>
      </div>
      <div class="header-nav">

        <a routerLink="/new-room" routerLinkActive="active" class="nav-link">
          <span class="nav-text">New Room</span>
        </a>
        <a routerLink="/seat-types" routerLinkActive="active" class="nav-link">
          <span class="nav-text">Seat Types</span>
        </a>

        <clr-dropdown>
          <a class="nav-link" routerLinkActive="active" clrDropdownTrigger>
            <span class="nav-text">Configuration</span>
          </a>

          <clr-dropdown-menu class="dropdown-menu">
            <button *ngFor="let room of rooms"
                    type="button"
                    class="dropdown-item" clrDropdownItem
                    [routerLink]="['room-config', room.id]">
              {{ room.roomName }}
            </button>
          </clr-dropdown-menu>
        </clr-dropdown>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  rooms;

  constructor(private db: DbService) {
  }

  ngOnInit() {
    this.db.getRoomConfigs().then(rooms => {
      this.rooms = rooms;
    });
  }

}
