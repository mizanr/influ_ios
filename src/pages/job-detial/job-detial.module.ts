import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobDetialPage } from './job-detial';

@NgModule({
  declarations: [
    JobDetialPage,
  ],
  imports: [
    IonicPageModule.forChild(JobDetialPage),
    TranslateModule.forChild()
  ],
})
export class JobDetialPageModule { }
