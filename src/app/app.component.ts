import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { Rest } from '../providers/rest';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html',
  providers: [Geolocation]
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public rest: Rest, public geol: Geolocation, public aler: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      splashScreen.hide();
      this.init();
    });
  }

  init(){
        this.rest.init().subscribe(
            data => {
              if(data.success)
              {
                //get location and update elements
                this.geol.getCurrentPosition().then((res) => {
                  this.rest.getCity(res.coords.latitude,res.coords.longitude).subscribe(
                    data => {
                      this.rest.setLocation(data.results[0].address_components[2].long_name);
                    },
                    err => {}
                  );
                }).catch((error) => {});
                //load all data
                this.rootPage = TabsPage;
              }
              else {
                this.aler.create({
                  title: 'An Error Ocurred!',
                  subTitle: data.msg,
                  buttons: ['OK']
                }).present();
              }
            },
            err => {
              this.aler.create({
                title: 'Connection Error!',
                message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                buttons: [ {
                    text: 'RETRY',
                    handler: () => { this.init(); }
                  } ]
              }).present();
            }
        );

  }


}
