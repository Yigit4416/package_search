import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AptSearchResult, DebianPackageInfo } from '../../../types/debian';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AptService {
  private httpClient = inject(HttpClient);

  readonly aptGeneralSearchResult = signal<AptSearchResult | null>(null);
  readonly aptSpecificResult = signal<DebianPackageInfo | null>(null);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  generalSearch(query: string) {
    this.loading.set(true);
    this.error.set(null);
    this.aptGeneralSearchResult.set(null);

    // FIXED: Added // after http:
    this.httpClient.get<AptSearchResult>(`http://localhost:3000/api/deb/apt/search?query=${query}`)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data: AptSearchResult) => {
          this.aptGeneralSearchResult.set(data);
        },
        error: (err: HttpErrorResponse) => {
          this.aptGeneralSearchResult.set(null);
          if (err.status === 404) {
            this.error.set("no packages found.");
          } else if (err.status === 400) {
            this.error.set("invalid search query.");
          } else {
            this.error.set(`an unexpected error occurred: ${err.message}`);
          }
          console.error('full error object:', err);
        }
      });
  }

  specificSearch(query: string) {
    this.loading.set(true);
    this.error.set(null);
    this.aptSpecificResult.set(null);

    // FIXED: Added // after http:
    this.httpClient.get<DebianPackageInfo>(`http://localhost:3000/api/deb/apt/package/${query}`)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data: DebianPackageInfo) => this.aptSpecificResult.set(data),
        error: (err: HttpErrorResponse) => {
          this.aptSpecificResult.set(null);
          if (err.status === 404) {
            this.error.set("no packages found.");
          } else if (err.status === 400) {
            this.error.set("invalid search query.");
          } else {
            this.error.set(`an unexpected error occurred: ${err.message}`);
          }
          console.error('full error object:', err);
        }
      });
  }
}