import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { LoginPopupPage } from './login-popup';

@NgModule({
  declarations: [
    LoginPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPopupPage),
    TranslateModule.forChild(),
  ],
})
export class LoginPopupPageModule {}
