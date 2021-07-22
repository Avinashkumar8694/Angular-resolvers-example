import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class NDataSourceService {

  constructor(private http: HttpClient) { }
  getDataSource() {
    return new Promise((resolve, reject) => {
      this.http.get('constants/app.const.json').subscribe(result => {
        window['neutrinos']['dataSource'] = result['dataSource'];
        return resolve(result);
      }, error => {
        return reject(error);
      })
    });
  }

}
