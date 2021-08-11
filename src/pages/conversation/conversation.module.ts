import { AutosizeModule } from 'ngx-autosize';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversationPage } from './conversation';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';

@NgModule({
  declarations: [
    ConversationPage,
  ],
  imports: [
    IonicPageModule.forChild(ConversationPage),
    TranslateModule.forChild(),
    NgxEmojiPickerModule,
    AutosizeModule
  ],
})
export class ConversationPageModule { }
