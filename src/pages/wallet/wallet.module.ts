import { WalletPage } from './wallet';


import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    WalletPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletPage,
    ),
    TranslateModule.forChild()
  ],
})
export class WalletPageModule { }
