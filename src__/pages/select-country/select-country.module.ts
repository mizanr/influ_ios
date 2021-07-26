import { SelectCountryPage } from './select-country';




import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SelectCountryPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectCountryPage,
    ),
    TranslateModule.forChild()
  ],
})
export class SelectCountryPageModule { }
