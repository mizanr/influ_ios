import { PaypalButtonPage } from './paypal-button';




import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PaypalButtonPage,
  ],
  imports: [
    IonicPageModule.forChild(PaypalButtonPage),
    TranslateModule.forChild()
  ],
})
export class PaypalButtonPageModule { }
