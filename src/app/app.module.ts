import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';  //test
import { MyApp } from './app.component';

import { HelpPage } from '../pages/help/help';
import { ShowsPage } from '../pages/shows/shows';
import { VenuesPage } from '../pages/venues/venues';
import { ShowDetailsPage } from '../pages/show-details/show-details';
import { BuyPage } from '../pages/buy/buy';
import { ProfilePage } from '../pages/profile/profile';
import { ShoppingcartPage } from '../pages/shoppingcart/shoppingcart';
import { MyPurchasesPage } from '../pages/mypurchases/mypurchases';
import { MyCheckerPage } from '../pages/mychecker/mychecker';
import { MyTicketsPage } from '../pages/mytickets/mytickets';
import { MyScannerPage } from '../pages/myscanner/myscanner';
import { MyListPage } from '../pages/mylist/mylist';
import { MyListCheckerPage } from '../pages/mylistchecker/mylistchecker';
import { PaymentPage } from '../pages/payment/payment';

import { TabsPage } from '../pages/tabs/tabs';

import { Rest } from '../providers/rest';
import  {Device } from '@ionic-native/device';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';


import { SplashScreen } from '@ionic-native/splash-screen';


@NgModule({
  declarations: [
    MyApp,

    HelpPage,
    ShowsPage,
    VenuesPage,
    ShowDetailsPage,
    BuyPage,
    ProfilePage,
    ShoppingcartPage,
    MyPurchasesPage,
    MyCheckerPage,
    MyTicketsPage,
    MyScannerPage,
    MyListPage,
    MyListCheckerPage,
    PaymentPage,

    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule, // test
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb','sqlite','websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    HelpPage,
    ShowsPage,
    VenuesPage,
    ShowDetailsPage,
    BuyPage,
    ProfilePage,
    ShoppingcartPage,
    MyPurchasesPage,
    MyCheckerPage,
    MyTicketsPage,
    MyScannerPage,
    MyListPage,
    MyListCheckerPage,
    PaymentPage,

    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,Rest,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
