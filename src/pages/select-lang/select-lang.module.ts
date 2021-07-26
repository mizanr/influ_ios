import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectLangPage } from './select-lang';

@NgModule({
  declarations: [
    SelectLangPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectLangPage),
    TranslateModule.forChild()
  ],
})
export class SelectLangPageModule {}
