import { NzSelectModeType } from 'ng-zorro-antd/select';
import { Observable } from 'rxjs';

import { FormGroup, ValidatorFn } from '@angular/forms';
import { eBucketName } from '@shared/enums/bucket-name.enum';

import { eDynamicField } from './dynamic-field.enum';

export interface TypeControl {
  field: eDynamicField;
  typeField?: string;
  inputMode?: string;
}

export interface Options {
  label: string;
  value?: string | number | boolean;
  disabled?: boolean;
  icon?: string;
}

export interface Select {
  options?: Options[];
  options$?: Promise<Options[]> | Observable<Options[]>;
  mode?: NzSelectModeType;
  showSearch?: boolean;
  hideClear?: boolean;
  hide?: string[];
  maxTagCount?: number;
  dropdownMatchSelectWidth?: boolean;
}

export interface DynamicFormDate {
  disableDate?: (current: Date) => boolean;
}

export interface iDynamicFormConfig {
  label?: string;
  name: string;
  type: TypeControl;

  object?: object;
  disabled?: boolean;
  hideIfDisabled?: boolean;
  hidden?: boolean;
  initialValue?: unknown;
  placeholder?: string;
  size?: number;
  mobileSize?: number;
  select?: Select;
  date?: DynamicFormDate;
  validations?: ValidatorFn | ValidatorFn[];
  hint?: string;
  help?: string;
  mask?: string;
  maskSuffix?: string;
  rows?: number;
  keepSpecialCharacters?: boolean;
  showForgotPassword?: boolean;
  forgotPasswordLink?: string;
  showPasswordIcon?: boolean;
  fileAccept?: string;
  autofocus?: boolean;
  addOnAfter?: string;
  addOnAfterIcon?: string;
  onAddOnAfterClick?: (form: FormGroup) => void;
  imageBucket?: eBucketName;
  onChange?: (data: unknown | null | object | boolean | string | number, form: FormGroup) => void;
  onOpenChange?: (open: boolean, form: FormGroup) => void;
}
