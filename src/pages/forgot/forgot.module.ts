import { ForgotPage } from './forgot';






import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ForgotPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPage),
    TranslateModule.forChild()
  ],
})
export class ForgotPageModule {}
