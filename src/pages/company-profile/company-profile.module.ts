
import { CompanyProfilePage } from './company-profile';




import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CompanyProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyProfilePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class CompanyProfilePageModule { }
