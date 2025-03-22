import { Injectable } from '@angular/core';
import { BaseApi } from '@shared/apis/base.api';

import { iUserCompany } from '../interfaces/user-company.interface';

@Injectable({
  providedIn: 'root',
})
export class UserCompanyApi extends BaseApi<iUserCompany> {
  constructor() {
    super('user_company');
  }
}
