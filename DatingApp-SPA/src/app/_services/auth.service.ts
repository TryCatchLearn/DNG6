import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodedToken: any;
  currentUser: User;
  jwtHelper = new JwtHelperService();
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model, this.requestOptions())
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.tokenString);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
            this.currentUser = user.user;
            this.userToken = user.tokenString;
            this.changeMemberPhoto(this.currentUser.photoUrl);
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
