import { Component } from '@angular/core';
import { NLocalStorageService, NTokenService } from 'neutrinos-seed-services';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>
             <n-snackbar></n-snackbar>`
})
export class LayoutComponent {
  constructor(private nLocalstorage: NLocalStorageService, private nTokenService: NTokenService) { }
  ngOnInit() {
    if (this.nLocalstorage.getValue('accessToken')) {
      this.nTokenService.updateSessionStorage();
    }

  }
}
