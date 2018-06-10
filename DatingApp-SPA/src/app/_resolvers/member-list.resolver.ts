import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {User} from '../_models/User';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {UserService} from '../_services/user.service';
import {AlertifyService} from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { PaginatedResult } from '../_models/Pagination';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
    pageSize = 5;
    pageNumber = 1;
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
