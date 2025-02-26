import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../model/user.type';
import { DashboardService } from '../../services/dashboard.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-account',
  imports: [NzIconModule, NzAvatarModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  service = inject(DashboardService);

  constructor() { }

  loading = true;
  userInfo: any;

  async ngOnInit() {
    if(this.service.userInfo.id === 0) await this.service.getUserInfo();
    else this.userInfo = this.service.userInfo;
    this.loading = false;
  }
}
