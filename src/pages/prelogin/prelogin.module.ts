import { PreloginPage } from './prelogin';





import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PreloginPage,
  ],
  imports: [
    IonicPageModule.forChild(PreloginPage),
    TranslateModule.forChild()
  ],
})
export class PreloginPageModule {}
