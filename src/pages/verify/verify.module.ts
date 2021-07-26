import { VerifyPage } from './verify';







import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    VerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyPage),
    TranslateModule.forChild()
  ],
})
export class VerifyPageModule {}
