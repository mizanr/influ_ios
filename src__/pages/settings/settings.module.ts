import { SettingsPage } from './settings';



import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage,
    ),
    TranslateModule.forChild()
  ],
})
export class SettingsPageModule { }
