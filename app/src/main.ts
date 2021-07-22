import { firebaseInitForServiceWorker } from './libConfig/firebaseInitForServiceWorker';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as firebase from 'firebase';
import { AppModule } from './app/app.module';
import { initChartJS } from './libConfig/initChartJS';
import { NSystemService } from 'neutrinos-seed-services';

if (environment.properties['production']) {
  enableProdMode();
}



function bootstrapNow() {
  platformBrowserDynamic().bootstrapModule(AppModule).then((data) => {
    NSystemService.getInstance();
    if (window['navigator'] && window['navigator']['splashscreen']) {
      // hide splash screen
      window['navigator']['splashscreen'].hide();
    }
    let pushType = environment.properties['pushType'] ? environment.properties['pushType'] : 'FCM';
    if (environment.properties['isNotificationEnabled'] && pushType.toUpperCase() === 'FCM') {
      firebaseInitForServiceWorker();
    }
    initChartJS();
  });
}

function checkDeviceLocal(): string {
  if(window['cordova']) {
    return 'mobile';
  } else {
    return 'browser';
  }
}


let deviceTypeLocal = checkDeviceLocal();

if (deviceTypeLocal == 'browser') {
  bootstrapNow();
}

/**
 * deviceready will only be triggered by a cordova app
 * and since we are not using cordova browser to server files.
 * However, if cordova browser would be used then the app will
 * get bootstrapped
 */
document.addEventListener('deviceready', function () {
  bootstrapNow();
});
