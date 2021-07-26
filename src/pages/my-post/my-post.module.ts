import { MyPostPage } from './my-post';


import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MyPostPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPostPage),
    TranslateModule.forChild()
  ],
})
export class MyPostPageModule {}
