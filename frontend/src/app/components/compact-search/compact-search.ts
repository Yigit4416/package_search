import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SearchType } from '../../../types/general'; // Types dosyanın yolu

@Component({
  selector: 'app-compact-search',
  standalone: true,
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonModule,
    MatSelectModule // Select modülü eklendi
  ],
  template: `
    <div class="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 px-4 shadow-sm">
      <div class="max-w-4xl mx-auto flex gap-3 items-center">
        
        <mat-form-field appearance="outline" class="flex-grow density-compact search-field" subscriptSizing="dynamic">
          <mat-icon matPrefix class="text-gray-400 !mr-2">search</mat-icon>
          <input 
            matInput 
            placeholder="Search packages..." 
            [(ngModel)]="query"
            (keyup.enter)="searchPackage()"
            class="text-gray-700"
          >
          @if (query()) {
            <button mat-icon-button matSuffix (click)="query.set('')">
              <mat-icon class="text-gray-400 scale-75">close</mat-icon>
            </button>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-40 density-compact select-field" subscriptSizing="dynamic">
          <mat-select [(ngModel)]="selectedMode">
            @for (mode of searchModes; track mode.modeIndex) {
              <mat-option [value]="mode">{{ mode.mode }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <button 
            mat-flat-button 
            color="primary" 
            class="h-[40px] rounded-lg !min-w-[60px]" 
            (click)="searchPackage()">
            GO
        </button>

      </div>
    </div>
  `,
  styles: [`
    /* Material Input ve Select'i aynı ince yüksekliğe (40px) getirmek için */
    :host ::ng-deep .density-compact .mat-mdc-form-field-flex {
      height: 40px;
      align-items: center;
      padding-top: 0 !important;
    }
    :host ::ng-deep .density-compact .mat-mdc-text-field-wrapper {
        padding-top: 0;
        padding-bottom: 0;
    }
    /* Select okunun ortalanması için */
    :host ::ng-deep .select-field .mat-mdc-select-arrow-wrapper {
        transform: translateY(0%);
    }
  `]
})
export class CompactSearchComponent implements OnInit {
  private router = inject(Router);

  // Parent'tan gelen bilgi: 'winget' | 'apt' | 'arch'
  // Örnek kullanım: <app-compact-search activeContext="winget" />
  activeContext = input<string>('winget'); 

  query = signal('');
  
  // Varsayılan mod (OnInit'te güncellenecek)
  selectedMode = signal<SearchType>({ mode: 'Winget Search', modeIndex: 2 });

  searchModes: SearchType[] = [
    { mode: 'Arch', modeIndex: 1 },
    { mode: 'Winget', modeIndex: 2 },
    { mode: 'APT', modeIndex: 3 },
  ];

  ngOnInit() {
    // Sayfa açıldığında parent'tan gelen bilgiye göre dropdown'ı ayarla
    const contextMap: {[key: string]: number} = { 'arch': 1, 'winget': 2, 'apt': 3 };
    const targetIndex = contextMap[this.activeContext()] || 2;
    
    const foundMode = this.searchModes.find(m => m.modeIndex === targetIndex);
    if (foundMode) {
      this.selectedMode.set(foundMode);
    }
  }

  searchPackage() {
    const term = this.query().trim();
    if (!term) return;

    // Component içindeki state'i kullanarak yönlendirme yap
    const currentModeIndex = this.selectedMode().modeIndex; // Signal'den değeri al

    console.log('Navigating -> Mode:', currentModeIndex, 'Term:', term);

    if (currentModeIndex === 1) {
      this.router.navigate(['/arch', term]);
    } else if (currentModeIndex === 2) {
      this.router.navigate(['/winget', term]);
    } else {
      this.router.navigate(['/apt', term]);
    }
  }
}