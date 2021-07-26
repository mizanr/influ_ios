import { SuccessfullPage } from './successfull';



import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SuccessfullPage,
  ],
  imports: [
    IonicPageModule.forChild(SuccessfullPage,
    ),
    TranslateModule.forChild()
  ],
})
export class SuccessfullPageModule { }
