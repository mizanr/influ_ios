import { TransferPage } from './transfer';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    TransferPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferPage,
    ),
    TranslateModule.forChild()
  ],
})
export class TransferPageModule { }
