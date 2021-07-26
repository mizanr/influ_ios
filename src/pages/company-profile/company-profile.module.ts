
import { CompanyProfilePage } from './company-profile';




import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    CompanyProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyProfilePage),
    TranslateModule.forChild(),
  ],
})
export class CompanyProfilePageModule { }
