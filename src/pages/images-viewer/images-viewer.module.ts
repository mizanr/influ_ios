import { ImagesViewerPage } from './images-viewer';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ImagesViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(ImagesViewerPage),
    TranslateModule.forChild()
  ],
})
export class ImagesViewerPageModule {}
