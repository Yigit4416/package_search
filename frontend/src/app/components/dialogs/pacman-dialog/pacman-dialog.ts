import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ArchService } from '../../../services/arch/arch-service';
import { ArchPackage } from '../../../../types/arch';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from "@angular/material/chips";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: 'app-pacman-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    DecimalPipe
  ],
  templateUrl: './pacman-dialog.html',
  styleUrl: './pacman-dialog.css',
})
export class PacmanDialog {
  private dialogRef = inject(MatDialogRef<PacmanDialog>);
  data = inject<{ packageName: string, initialData?: ArchPackage }>(MAT_DIALOG_DATA);
  protected archService = inject(ArchService);
  private clipboard = inject(Clipboard);

  // Servisten gelen veriyi tutan signal, yoksa initial data'yı kullan
  info = computed(() => this.archService.pacmanSpecificPackageResult() ?? this.data.initialData);

  // Kopyalandı ikonu için state
  copied = signal(false);

  // Versiyon
  latestVersion = computed(() => this.info()?.pkgver ?? 'Unknown');

  // Kurulum Komutu
  installCommand = computed(() => `sudo pacman -S ${this.info()?.pkgname}`);

  constructor() {
    // Dialog açılınca veriyi çek, ama initialData varsa hemen gösteririz
    if (this.data.packageName) {
      this.archService.pacmanSpecificPackage(this.data.packageName);
    }
  }

  copyCommand() {
    const cmd = this.installCommand();
    this.clipboard.copy(cmd);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  openLink(url: string | undefined) {
    if (url) window.open(url, '_blank');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
