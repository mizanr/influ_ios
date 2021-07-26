import { FilterInfluPage } from './filter-influ';










import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    FilterInfluPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterInfluPage),
    TranslateModule.forChild()
  ],
})
export class FilterInfluPageModule {}
