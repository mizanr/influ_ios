import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMessagePage } from './send-message';

@NgModule({
  declarations: [
    SendMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(SendMessagePage),
    TranslateModule.forChild()
  ],
})
export class SendMessagePageModule { }
