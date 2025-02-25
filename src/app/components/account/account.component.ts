import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../model/user.type';
import { AuthService } from '../../services/auth.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-account',
  imports: [NzIconModule, NzAvatarModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  auth = inject(AuthService);

  constructor() { }

  loading = true;
  userInfo: User = {
    id: 0,
    email: '',
    password: '',
    name: '',
    role: '',
    avatar: '',
    creationAt: '',
    updatedAt: '',
  };
  async ngOnInit() {
    await this.auth.getUserInfo();
    this.userInfo = this.auth.userObj;
    this.loading = false;
  }
}
