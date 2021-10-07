import { Component } from '@angular/core';

import { HelpPage } from '../help/help';
import { ShowsPage } from '../shows/shows';
import { VenuesPage } from '../venues/venues';
import { ProfilePage } from '../profile/profile';
import { ShoppingcartPage } from '../shoppingcart/shoppingcart';

import { Rest } from '../../providers/rest';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabShows: any = ShowsPage;
  tabVenues: any = VenuesPage;
  tabCart: any = ShoppingcartPage;
  tabProfile: any = ProfilePage;
  tabHelp: any = HelpPage;

  constructor(rest: Rest) {

  }
}
