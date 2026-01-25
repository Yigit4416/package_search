import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ArchService } from '../../../services/arch/arch-service';
import { AurPackage } from '../../../../types/arch';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from "@angular/material/chips";

@Component({
  selector: 'app-aur-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './aur-dialog.html',
  styleUrl: './aur-dialog.css',
})

//Need to remake the html...
// and i need to send the ID not other things...

export class AurDialog {
  private dialogRef = inject(MatDialogRef<AurDialog>);
  data = inject<{ packageName: string, initialData?: AurPackage }>(MAT_DIALOG_DATA);
  protected archService = inject(ArchService);
  private clipboard = inject(Clipboard);

  // Servisten gelen veriyi tutan signal, yoksa initial data'yı kullan
  info = computed(() => this.archService.aurSpecificPackageResult() ?? this.data.initialData);

  // Kopyalandı ikonu için state
  copied = signal(false);

  // AUR Versiyonu
  latestVersion = computed(() => this.info()?.Version ?? 'Unknown');

  // Kurulum Komutu
  installCommand = computed(() => `paru -S ${this.info()?.Name}`);

  constructor() {
    // Dialog açılınca veriyi çek, ama initialData varsa hemen gösteririz
    if (this.data.packageName) {
      this.archService.aurSpecificPackage(this.data.packageName);
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
