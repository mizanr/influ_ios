import { ComponentsModule } from './../../components/components.module';

import { HomeInfluencerPage } from './home-influencer';


import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    HomeInfluencerPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeInfluencerPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class HomeInfluencerPageModule { }
