import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponents } from './app/app.components';

bootstrapApplication(AppComponents, appConfig)
  .catch((err) => console.error(err));
