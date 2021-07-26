import { PaymentPage } from './payment';



import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentPage),
    TranslateModule.forChild()
  ],
})
export class OwnerProfilePageModule { }
