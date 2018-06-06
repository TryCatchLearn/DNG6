import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodedToken: any;
  jwtHelper = new JwtHelperService();

constructor(private http: HttpClient) { }


  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model, this.requestOptions())
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.tokenString);
            this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
            console.log(this.decodedToken);
            this.userToken = user.tokenString;
          }
        })
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model, this.requestOptions());
  }

  loggedIn() {
    // const helper = new JwtHelperService();
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  private requestOptions() {
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json');
    return {headers};
  }
}
