import { CreatePasswordPage } from './create-password';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    CreatePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePasswordPage),
    TranslateModule.forChild()
  ],
})
export class CreatePasswordPageModule { }
