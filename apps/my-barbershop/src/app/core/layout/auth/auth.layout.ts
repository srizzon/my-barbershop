import { NzCardComponent } from 'ng-zorro-antd/card';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mb-auth',
  imports: [NzCardComponent, RouterModule],
  templateUrl: './auth.layout.html',
  styleUrl: './auth.layout.scss',
})
export class AuthLayout {}
