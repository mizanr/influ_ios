import { InfluencerProfilePage } from './influencer-profile';






import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    InfluencerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(InfluencerProfilePage),
    TranslateModule.forChild()
  ],
})
export class InfluencerProfilePageModule {}
