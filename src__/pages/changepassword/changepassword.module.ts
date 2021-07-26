import { ChangepasswordPage } from './changepassword';



import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ChangepasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangepasswordPage),
    TranslateModule.forChild()
  ],
})
export class ChangepasswordPageModule {}
