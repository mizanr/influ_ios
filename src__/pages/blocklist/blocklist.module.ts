import { BlocklistPage } from './blocklist';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    BlocklistPage,
  ],
  imports: [
    IonicPageModule.forChild(BlocklistPage),
    TranslateModule.forChild()
  ],
})
export class BlocklistPageModule {}
