import { HiredByPage } from './hired-by';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    HiredByPage,
  ],
  imports: [
    IonicPageModule.forChild(HiredByPage),
    TranslateModule.forChild()
  ],
})
export class HiredByPageModule {}
