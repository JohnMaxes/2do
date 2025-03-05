import { Component, inject } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [NzMenuModule, NzIconModule, RouterOutlet, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DashboardService]
})
export class DashboardComponent {
  service = inject(DashboardService);
  async ngOnInit() {
    await this.service.getUserInfo();
    console.log('User info fetched!');
  }
}
