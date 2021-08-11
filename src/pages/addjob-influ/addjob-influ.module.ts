import { ComponentsModule } from './../../components/components.module';
import { AddjobInfluPage } from './addjob-influ';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    AddjobInfluPage
  ],
  imports: [
    IonicPageModule.forChild(AddjobInfluPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class AddjobInfluPageModule { }
