import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import {
  defineAppBarComponent,
  defineAppBarMenuButtonComponent,
  defineAppBarSearchComponent,
  defineButtonComponent,
  defineCardComponent,
  defineCheckboxComponent,
  defineDrawerComponent,
  defineExpansionPanelComponent,
  defineIconButtonComponent,
  defineIconComponent,
  defineListComponent,
  defineOpenIconComponent,
  defineScaffoldComponent,
  defineTextFieldComponent
} from '@tylertech/forge';

defineScaffoldComponent();
defineAppBarComponent();
defineAppBarMenuButtonComponent();
defineAppBarSearchComponent();
defineIconComponent();
defineCardComponent();
defineDrawerComponent();
defineListComponent();
defineOpenIconComponent();
defineIconButtonComponent();
defineButtonComponent();
defineCheckboxComponent();
defineTextFieldComponent();
defineExpansionPanelComponent();


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
