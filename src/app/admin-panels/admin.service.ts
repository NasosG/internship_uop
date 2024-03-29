import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { RoleModel } from './role.model';
import {catchError, throwError} from 'rxjs';

const API_URL = environment.apiUrl + "/admin/";
const ATLAS_URL = environment.apiUrl + "/atlas/"

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  insertRoles(roles: any) {
    const form: RoleModel = roles;
    this.http
      .post<{ message: string }>(API_URL + "insertRoles/", form)
      .subscribe(responseData => {
        console.log(responseData.message);
        location.reload();
      });
  }

  getRoles() {
    return this.http.get(API_URL + '/admin/');
  }

  getUsersWithRoles() {
    return this.http.get(API_URL + 'getUsers/');
  }

  getDepartmentsOfUserByUserID(userID: number) {
    return this.http.get(API_URL + 'getDepartmentsOfUserByUserID/' + userID);
  }

  deleteRolesByUserId(userId: number) {
    this.http
      .delete<{ message: string }>(API_URL + 'deleteRolesByUserId/' + userId)
      .subscribe(responseData => {
        console.log(responseData.message);
        location.reload();
      });
  }

  syncPosition(positionId: string) {
    return this.http.post<{ message: string }>(ATLAS_URL + `sync/position/${positionId}`, {}).pipe(
      catchError(error => {
        console.error('Error syncing position:', error.message);
        return throwError('An error occurred while syncing the position. Please try again.');
      })
    );
  }
}
