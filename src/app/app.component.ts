import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from './models';
import { AuthenticationService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weighingSoftwareUI';
  currentUser!: User;

  constructor(private translate: TranslateService,
    private authenticationService: AuthenticationService) {
    this.setDefaultLang();
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.translate.setDefaultLang(x?.language || 'en');
    });
   
  }

  private setDefaultLang() {
    this.translate.addLangs(['en', 'ar']); // array of available langs
    this.translate.setDefaultLang('en');
  }

}
