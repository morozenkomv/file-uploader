import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class HomeComponent {
  progress: number;

  signup = new FormGroup({
    image: new FormControl(null, [Validators.required, this.requiredFileType('png')])
  });

  dataSource: MatTableDataSource<any>;

  columnsToDisplay = ['position', 'image', 'name', 'size'];
  expandedElement: PeriodicElement | null;
  loading = false;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.list();
  }

  submit() {
    const formData = new FormData();
    formData.append('file', this.signup.controls['image'].value);

    this.http.post('https://localhost:5001/api/files', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round((100 * event.loaded) / event.total);
      }

      if (event.type === HttpEventType.Response) {
        this.signup.get('image').patchValue('');
        this.progress = 0;
        this.list();
      }

    });
  }

  list() {
    this.loading = true;
    this.dataSource = new MatTableDataSource([]);

    this.http.get('https://localhost:5001/api/files').subscribe(
      (res: any[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.loading = false;

      },
      (err) => {
        alert(err);
        console.error(err);
        this.loading = false
      });
  }

  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }

  requiredFileType(type: string) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }

      return null;
    };
  }

}
