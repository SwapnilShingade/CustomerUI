import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  public apiUrl = 'http://localhost:60563/api/customer';


  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get(this.apiUrl + '/categories');
  }

  getCustomers(categoryId: number) {
    return this.http.get(this.apiUrl + '/customers/'+categoryId);
  }
}
