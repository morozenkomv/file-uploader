import { Injectable, Inject, EventEmitter, Injector } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAgentApplication, Configuration } from 'msal'
import { map } from 'rxjs/operators';

interface Ticket {
  accessToken: string;
  module_path: string;
  expires_in: string;
  refresh_token: string;
  token_type: string;
  username: string;
  firstname: string;
  lastname: string;
  patronymic: string;
  email: string;
}

@Injectable()
export class AuthService {
  private userAgentApplication;

  private readonly authTicketKey = 'auth_ticket';
  private readonly user_data = 'user_data';

  private get _ticket(): Ticket {
    return JSON.parse(localStorage.getItem(this.authTicketKey)) as Ticket;
  }
  private set _ticket(ticket: Ticket) {
    if (!ticket)
      localStorage.removeItem(this.authTicketKey);

    localStorage.setItem(this.authTicketKey, JSON.stringify(ticket));
  }

  onUserInfo: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string,
    private _injector: Injector
  ) {

    var applicationConfig: Configuration = {
      auth: {
        clientId: "18803cf3-494c-47a7-8b2e-56f48ba6cbf5",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "https://localhost:5001/login"
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    };

    this.userAgentApplication = new UserAgentApplication(applicationConfig);

  }

  initUser() {
    if (!this._hasTicket())
      this.webLogout(false);
    else {
      const router = this._injector.get(Router);
      router.navigate(['/']);
    }
  }

  get userInfo() {
    return localStorage.getItem(this.user_data)
      ? JSON.parse(localStorage.getItem(this.user_data))
      : null;
  }

  get userInfoSubscription(): Observable<any> {
    return new Observable(observer => {
      if (this.userInfo)
        observer.next(this.userInfo);
      else
        this.onUserInfo.subscribe((userInfo: any) => {
          localStorage.setItem(this.user_data, JSON.stringify(userInfo))
          observer.next(userInfo);
        });
    });
  }

  logout() {
    if (!this._hasTicket())
      return;

    this.userAgentApplication.logout();
    this.onUserInfo.emit(null);
    this.webLogout();
  }

  webLogout(redirectToLoginPage = true) {
    this._removeTicket();
    localStorage.removeItem(this.user_data);

    const router = this._injector.get(Router);
    const location = this._injector.get(Location);

    if (redirectToLoginPage)
      router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        router.navigate(['/login'], { queryParams: { returnUrl: location.path() } }));
  }

  get isLoggedIn() {
    return this._hasTicket();
  }
  
  private _hasTicket(): boolean {
    return !!this._ticket;
  }

  private _removeTicket() {
    this._ticket = null;    
  }

  private setTicket(ticket: Ticket) {
    if (!ticket || !ticket.accessToken)
      console.log('error');

    this._ticket = ticket;
    return ticket;
  }

  private redirectToReturnUrl() {
    const router = this._injector.get(Router);
    const route = this._injector.get(ActivatedRoute);

    const returnUrl = route.snapshot.queryParams['returnUrl'] || '/';
    router.navigate([returnUrl]);
  }

  microsoftSignIn() {
    var graphScopes = {
      scopes: ["user.read"]
    }; // ["user.read"];
    let that = this;

    that.userAgentApplication.loginPopup(graphScopes).then(function (idToken) {
      //Login Success
      that.userAgentApplication.acquireTokenSilent(graphScopes).then(function (tokenResponse) {

        that.setTicket(tokenResponse);

        //console.log(tokenResponse)
        //AcquireTokenSilent Success
        var headers = new Headers();
        var bearer = "Bearer " + tokenResponse.accessToken;
        headers.append("Authorization", bearer);
        var options = {
          method: "GET",
          headers: headers
        };
        var graphEndpoint = "https://graph.microsoft.com/v1.0/me";

        fetch(graphEndpoint, options)
          .then(function (response) {

            response.json().then(function (data) {
              that.onUserInfo.emit(data);
            })

            that.redirectToReturnUrl();
          })
      }, function (error) {
        //AcquireTokenSilent Failure, send an interactive request.
        that.userAgentApplication.acquireTokenPopup(graphScopes).then(function (accessToken) {
          //updateUI();
        }, function (error) {
          console.log(error);
        });
      })
    }, function (error) {
      //login failure
      console.log(error);
    });
  }

}
