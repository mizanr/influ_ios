import { OwnerProfilePage } from './owner-profile';


import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    OwnerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(OwnerProfilePage),
    TranslateModule.forChild()
  ],
})
export class OwnerProfilePageModule {}
