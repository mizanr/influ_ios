import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeRoomPage } from './home-room';

@NgModule({
  declarations: [
    HomeRoomPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeRoomPage),
  ],
})
export class HomeRoomPageModule {}
