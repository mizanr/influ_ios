import { SearchInfluPage } from './search-influ';



import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SearchInfluPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchInfluPage),
    TranslateModule.forChild()
  ],
})
export class SearchInfluPageModule { }
