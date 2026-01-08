import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArchService } from '../../services/arch/arch-service';
import { WingetService } from '../../services/winget/winget-service';
import { AptService } from '../../services/debian/apt-service';
import { SearchType } from '../../../types/general';
import { Router } from '@angular/router';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatInputModule],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.css'],
})
export class MainPage {
  // Routing
  private router = inject(Router);

  // Services
  protected readonly archService = inject(ArchService);
  protected readonly wingetService = inject(WingetService);
  protected readonly aptService = inject(AptService);

  // Properties
  searchTerm = signal<string>('');
  selectedMode = signal<SearchType>({ mode: 'APT Search', modeIndex: 3 });
  searchModes: SearchType[] = [
    { mode: 'Arch Search ', modeIndex: 1 },
    { mode: 'Winget Search ', modeIndex: 2 },
    { mode: 'APT Search', modeIndex: 3 },
  ];

  // Make the search
  searchPackage() {
    console.log('Selected Mode:', this.selectedMode());
    console.log('Search Term:', this.searchTerm());
    if (this.selectedMode().modeIndex === 1) {
      this.router.navigate(['/arch', this.searchTerm()]);
    } else if (this.selectedMode().modeIndex === 2) {
      this.router.navigate(['/winget', this.searchTerm()]);
    } else {
      this.router.navigate(['/apt', this.searchTerm()]);
    }
  }
}
