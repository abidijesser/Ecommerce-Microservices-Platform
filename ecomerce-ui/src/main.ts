import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCe0x0RHxbf1x1ZFZMZF1bQX5PIiBoS35Rc0VnW35fdXBSRmJUVEZ2VEBU');
