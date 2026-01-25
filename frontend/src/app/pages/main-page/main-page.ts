import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material Modülleri
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // <--- YENİ: İkon için gerekli

// Servisler ve Tipler
import { ArchService } from '../../services/arch/arch-service';
import { WingetService } from '../../services/winget/winget-service';

import { SearchType } from '../../../types/general';

@Component({
  selector: 'app-main-page',
  standalone: true,
  // MatIconModule'ü buraya imports dizisine ekledik
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.css'],
})
export class MainPage {
  // Routing
  private router = inject(Router);

  // Services
  protected readonly archService = inject(ArchService);
  protected readonly wingetService = inject(WingetService);


  // Properties
  searchTerm = signal<string>('');
  selectedMode = signal<SearchType>({ mode: 'Winget Search', modeIndex: 2 });

  searchModes: SearchType[] = [
    { mode: 'Arch Search', modeIndex: 1 },
    { mode: 'Winget Search', modeIndex: 2 },

  ];

  // Search Logic
  searchPackage() {
    const term = this.searchTerm().trim();

    // Boş arama yapılmasını engellemek için kontrol
    if (!term) return;

    console.log('Selected Mode:', this.selectedMode());
    console.log('Search Term:', term);

    if (this.selectedMode().modeIndex === 1) {
      this.router.navigate(['/arch', term]);
    } else if (this.selectedMode().modeIndex === 2) {
      this.router.navigate(['/winget', term]);
    }
  }
}