import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HiredListPage } from './hired-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HiredListPage,
  ],
  imports: [
    IonicPageModule.forChild(HiredListPage),
    TranslateModule.forChild()
  ],
})
export class HiredListPageModule {}
