import { RequestListPage } from './request-list';


import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    RequestListPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestListPage),
    TranslateModule.forChild()
  ],
})
export class RequestListPageModule { }
