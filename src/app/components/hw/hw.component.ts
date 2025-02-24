import { Component } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-hw',
  imports: [NzMenuModule, NzIconModule, RouterOutlet, RouterLink],
  templateUrl: './hw.component.html',
  styleUrl: './hw.component.css'
})
export class HwComponent {}
