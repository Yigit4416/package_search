import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ArchPackage, ArchPackageQueryResponse, AurPackage, AurQueryResponse } from '../../../types/arch';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArchService {
  private httpClient = inject(HttpClient)

  readonly pacmanGeneralSearchResult = signal<ArchPackage[]>([])
  readonly pacmanSpecificPackageResult = signal<ArchPackage | null>(null)

  readonly aurGeneralSearchResult = signal<AurQueryResponse | null>(null)
  readonly aurSpecificPackageResult = signal<AurPackage | null>(null)

  loading = signal<boolean>(false)
  error = signal<string | null>(null)

  pacmanGeneralSearch(query: string) {
    this.loading.set(true)
    this.pacmanGeneralSearchResult.set([])
    this.error.set(null)

    this.httpClient.get<ArchPackageQueryResponse>(`http://localhost:3000/api/arch/pacman/search?query=${query}`)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data: ArchPackageQueryResponse) => {
          this.pacmanGeneralSearchResult.set(data.data)
        },
        error: (err: HttpErrorResponse) => {
          // clear previous results if that's desired behavior
          this.pacmanGeneralSearchResult.set([]);

          // handle specific status codes
          if (err.status === 404) {
            console.error(err.message)
            this.error.set("no packages found.");
          } else if (err.status === 400) {
            this.error.set("invalid search query.");
          } else {
            // generic fallback for 500s or network errors
            this.error.set(`an unexpected error occurred: ${err.message}`);
          }

          console.error('full error object:', err);
        }
      })
  }

  pacmanSpecificPackage(query: string) {
    this.loading.set(true)
    this.pacmanSpecificPackageResult.set(null)
    this.error.set(null)

    this.httpClient.get<ArchPackage>(`http://localhost:3000/api/arch/pacman/package/${query}`)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data: ArchPackage) => {
          this.pacmanSpecificPackageResult.set(data)
        },
        error: (err: HttpErrorResponse) => {
          // clear previous results if that's desired behavior
          this.pacmanSpecificPackageResult.set(null);

          // handle specific status codes
          if (err.status === 404) {
            console.error(err.message)
            this.error.set("no packages found.");
          } else if (err.status === 400) {
            this.error.set("invalid search query.");
          } else {
            // generic fallback for 500s or network errors
            this.error.set(`an unexpected error occurred: ${err.message}`);
          }

          console.error('full error object:', err);
        }
      })
  }

  aurGeneralSearch(query: string) {
    this.loading.set(true)
    this.aurGeneralSearchResult.set(null)
    this.error.set(null)

    this.httpClient.get<AurQueryResponse>(`http://localhost:3000/api/arch/aur/search?query=${query}`)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data: AurQueryResponse) => {
          this.aurGeneralSearchResult.set(data)
        },
        error: (err: HttpErrorResponse) => {
          // clear previous results if that's desired behavior
          this.aurGeneralSearchResult.set(null);

          // handle specific status codes
          if (err.status === 404) {
            console.error(err.message)
            this.error.set("no packages found.");
          } else if (err.status === 400) {
            this.error.set("invalid search query.");
          } else {
            // generic fallback for 500s or network errors
            this.error.set(`an unexpected error occurred: ${err.message}`);
          }

          console.error('full error object:', err);
        }
      })
  }

  aurSpecificPackage(query: string) {
    this.loading.set(true)
    this.aurSpecificPackageResult.set(null)
    this.error.set(null)

    this.httpClient.get<AurPackage>(`http://localhost:3000/api/arch/aur/package/${query}`)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data: AurPackage) => {
          this.aurSpecificPackageResult.set(data)
        },
        error: (err: HttpErrorResponse) => {
          // clear previous results if that's desired behavior
          this.aurSpecificPackageResult.set(null);

          // handle specific status codes
          if (err.status === 404) {
            console.error(err.message)
            this.error.set("no packages found.");
          } else if (err.status === 400) {
            this.error.set("invalid search query.");
          } else {
            // generic fallback for 500s or network errors
            this.error.set(`an unexpected error occurred: ${err.message}`);
          }

          console.error('full error object:', err);
        }
      })
  }
}
