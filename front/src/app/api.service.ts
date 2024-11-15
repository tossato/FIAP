import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class ApiService {

  constructor(private http: HttpClient) { }

  async postData(apiUrl: string, data: any): Promise<any> {



  }
}
