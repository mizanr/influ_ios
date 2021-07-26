import { AutofillPlacesPage } from './autofill-places';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    AutofillPlacesPage,
  ],
  imports: [
    IonicPageModule.forChild(AutofillPlacesPage),
    TranslateModule.forChild()
  ],
})
export class AutofillPlacesPageModule {}
