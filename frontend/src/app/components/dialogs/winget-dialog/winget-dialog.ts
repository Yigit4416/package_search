import { Component, inject, Inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WingetService } from '../../../services/winget/winget-service';
import { 
  MatDialogRef, 
  MAT_DIALOG_DATA, 
  MatDialogContent, 
  MatDialogActions,
  MatDialogTitle 
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; // Added for hover tooltips

@Component({
  selector: 'app-winget-dialog',
  templateUrl: './winget-dialog.html',
  styleUrl: './winget-dialog.css',
  imports: [
    CommonModule,
    MatDialogContent, 
    MatDialogActions, 
    MatDialogTitle,
    MatButtonModule, 
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
})
export class WingetDialog implements OnInit {
  
  private dialogRef = inject(MatDialogRef<WingetDialog>);
  protected readonly wingetService = inject(WingetService);
  
  // Track copy button state
  copied = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { packageName: string }
  ) { }

  // --- COMPUTED SIGNALS ---

  // 1. Safely get the latest version string
  latestVersion = computed(() => {
    const pkg = this.wingetService.wingetPackageSpecific();
    // Versions is an array of strings ["6.09"], take the last one
    return pkg?.Versions?.at(-1) ?? '-'; 
  });

  // 2. Helper to get the Latest info object easily
  info = computed(() => {
    return this.wingetService.wingetPackageSpecific()?.Latest;
  });

  // 3. Generate the install command dynamically
  installCommand = computed(() => {
    const id = this.wingetService.wingetPackageSpecific()?.Id;
    // const version = this.latestVersion();
    
    if (!id) return '';
    //  -v ${version} -e --accept-package-agreements
    // we can use this later on...
    return `winget install --id ${id}`;
  });

  // --- LIFECYCLE & METHODS ---

  ngOnInit() {
    this.detailPage();
  }

  detailPage() {
    if (this.data.packageName) {
      this.wingetService.wingetSpecificSearch(this.data.packageName);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
  
  openLink(url: string | undefined) {
    if (url) window.open(url, '_blank');
  }

  copyCommand() {
    const command = this.installCommand();
    navigator.clipboard.writeText(command).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000); // Reset after 2s
    });
  }
}