import { TextModalPage } from './text-modal';


import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    TextModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TextModalPage,
    ),
    TranslateModule.forChild()
  ],
})
export class TextModalPageModule { }
