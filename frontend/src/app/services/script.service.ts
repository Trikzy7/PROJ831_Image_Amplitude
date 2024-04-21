import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class scriptService {

  constructor(private http: HttpClient) { }

  executeAmplitudeProcessAndConvertScript(listInputPathZip: any[], polygon: string, pathGpt: string) {

    const url = `http://localhost:3000/api/script/execute-amplitude-process-convert-scripts`;

    let dataToSend = {
      listInputPathZip: listInputPathZip,
      polygon: polygon,
      pathGpt: pathGpt
    }

    console.log(dataToSend);



    return this.http.post(url, dataToSend).pipe(
      map((data: any) => {
        return data;
      })
    )
  }

  executeAmplitudeScripts(polygon: string, username: string, password: string, dateStart: string, dateEnd: string, pathGpt: string, listDateMissing: string[]) {

    const url = `http://localhost:3000/api/script/execute-amplitude-scripts`;

    let dataToSend = {
      polygon: polygon,
      username: username,
      password: password,
      pathGpt: pathGpt,
      dateStart: "",
      dateEnd: "",
      listDateMissing: [] as string[]
    }


    if (listDateMissing.length === 0) {
      // Add dateStart and dateEnd to dataToSend
      dataToSend.dateStart = dateStart;
      dataToSend.dateEnd = dateEnd;
      
    } else {
      // Add listDateMissing to dataToSend
      dataToSend.listDateMissing = listDateMissing as string[];
    }


    return this.http.post(url, dataToSend).pipe(
      map((data: any) => {
        return data;
      })
    )

  }
}
