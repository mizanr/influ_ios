import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceComponent } from '../../components/service/service';
import { HomePage } from './home';

@NgModule({
  declarations: [
    HomePage,
    ServiceComponent,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule.forChild()
  ],
})
export class HomePageModule {}
