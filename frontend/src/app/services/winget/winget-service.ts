import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { WingetPackage, WingetQueryResponse } from '../../../types/winget';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WingetService {
  private httpClient = inject(HttpClient);

  readonly wingetSearch = signal<WingetPackage[]>([]);
  readonly wingetPackageSpecific = signal<WingetPackage | null>(null);
  readonly loading = signal(false);
  error = signal<string | null>(null);

  wingetGeneralSearch(query: string) {
    // 1. Reset state before the request starts
    this.loading.set(true);
    this.error.set(null);

    this.httpClient
      .get<WingetQueryResponse>(`${environment.apiUrl}/api/winget/search?query=${query}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        // SUCCESS CASE
        next: (data: WingetQueryResponse) => {
          const realData = data.data.Packages;
          this.wingetSearch.set(realData);
          console.log(realData);
        },

        // ERROR CASE
        error: (err: HttpErrorResponse) => {
          // clear previous results if that's desired behavior
          this.wingetSearch.set([]);

          // handle specific status codes
          if (err.status === 404) {
            this.error.set('no packages found.');
          } else if (err.status === 400) {
            this.error.set('invalid search query.');
          } else {
            // generic fallback for 500s or network errors
            this.error.set(`an unexpected error occurred: ${err.message}`);
          }

          console.error('full error object:', err);
        },
      });
  }

  wingetSpecificSearch(query: string) {
    this.loading.set(true);
    this.error.set(null);

    this.httpClient
      .get<WingetPackage>(`${environment.apiUrl}/api/winget/package/${query}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data: WingetPackage) => {
          this.wingetPackageSpecific.set(data);
        },

        error: (err: HttpErrorResponse) => {
          // clear previous results if that's desired behavior
          this.wingetPackageSpecific.set(null);

          // handle specific status codes
          if (err.status === 404) {
            this.error.set('no packages found.');
          } else if (err.status === 400) {
            this.error.set('invalid search query.');
          } else {
            // generic fallback for 500s or network errors
            this.error.set(`an unexpected error occurred: ${err.message}`);
          }

          console.error('full error object:', err);
        },
      });
  }
}
