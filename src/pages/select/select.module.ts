import { SelectPage } from './select';








import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SelectPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectPage),
    TranslateModule.forChild()
  ],
})
export class SelectPageModule {}
