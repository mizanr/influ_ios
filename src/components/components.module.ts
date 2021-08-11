import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderIconComponent } from './header-icon/header-icon';
import { PostComponent } from './post/post';
@NgModule({
    declarations: [
        HeaderIconComponent,
        PostComponent
    ],
    imports: [IonicPageModule.forChild(HeaderIconComponent),
    TranslateModule.forChild()],
    exports: [
        HeaderIconComponent,
        PostComponent
    ],
    // schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
