import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppliedInfluencerPage } from './applied-influencer';

@NgModule({
  declarations: [
    AppliedInfluencerPage,
  ],
  imports: [
    IonicPageModule.forChild(AppliedInfluencerPage),
    TranslateModule.forChild()
  ],
})
export class AppliedInfluencerPageModule {}
