import { PrivacyPage } from './privacy';









import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PrivacyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyPage),
    TranslateModule.forChild()
  ],
})
export class PrivacyPageModule {}
