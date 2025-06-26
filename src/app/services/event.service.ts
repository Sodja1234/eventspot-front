import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../environnement/environnement';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { EventSearch } from '../models/event';
import { ResponseThree, Response} from '../models/response';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient , private userService: UserService) {}

  createEvent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/evenements`, data);
  }

  getCategories(url?: string, all?: boolean): Observable<Response<Category>> {
    if (url != null) {
      return this.http.get<Response<Category>>(`${url}`);
    }
    if(all) {

      return this.http.get<Response<Category>>(`${this.apiUrl}/categories?all=1`);
    }
    return this.http.get<Response<Category>>(`${this.apiUrl}/categories`);
  }


  getEventById(id: number): Observable<{ data: EventSearch }> {
    return this.http.get<{ data: EventSearch }>(`${this.apiUrl}/events/id/${id}`);
  }

  getLastEvents(count: number = 3, excludeId: number = 0): Observable<ResponseThree<EventSearch>> {
    if(excludeId) {
      return this.http.get<ResponseThree<EventSearch>>(`${this.apiUrl}/events?latest=true&count=${count}&exclude=true&exclude_id=${excludeId}`);
    }
    return this.http.get<ResponseThree<EventSearch>>(`${this.apiUrl}/events?latest=true&count=${count}`);
  }

  getEvents(url: string): Observable<Response<EventSearch>> {
    if (url != null) {
      return this.http.get<Response<EventSearch>>(`${url}`);
    }
    return this.http.get<Response<EventSearch>>(`${this.apiUrl}/events`);
  }


  getOrganizerEvents(
  filter: string = 'all',
  search: string = '',
  page: number = 1,
  perPage: number = 6
): Observable<any> {
  const token = this.userService.getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  let params = new HttpParams()
    .set('page', page.toString())
    .set('perPage', perPage.toString());

  if (search) {
    params = params.set('search', search);
  }

  return this.http.get(`${this.apiUrl}/dashboard/organizer/events/${filter}`, {
    headers,
    params, 
  });
}



  getOrganizerTickets(): Observable<any> {

const token = this.userService.getToken();
  console.log('Token utilisé pour l\'authentification :', token);

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.get(`${this.apiUrl}/dashboard/user/tickets`, {
    headers,
  });
}


getSubscribers(eventId: number): Observable<any> {
  const token = this.userService.getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.get(`${this.apiUrl}/events/${eventId}/subscribers`, {
    headers,
  });
}

}