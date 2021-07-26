import { JobListPage } from './job-list';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    JobListPage,
  ],
  imports: [
    IonicPageModule.forChild(JobListPage),
    TranslateModule.forChild()
  ],
})
export class JobListPageModule {}
