import { AutosizeModule } from 'ngx-autosize';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { ChatDetailsPage } from './chat-details';



import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ChatDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatDetailsPage),
    TranslateModule.forChild(),
    NgxEmojiPickerModule,
    AutosizeModule
  ],
})
export class ChatDetailsPageModule { }
