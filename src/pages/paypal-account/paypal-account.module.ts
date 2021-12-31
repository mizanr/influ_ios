import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaypalAccountPage } from './paypal-account';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PaypalAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(PaypalAccountPage),
    TranslateModule.forChild()
  ],
})
export class PaypalAccountPageModule {}
