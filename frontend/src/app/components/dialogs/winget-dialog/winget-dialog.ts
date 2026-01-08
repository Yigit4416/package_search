import { Component, inject, Inject } from '@angular/core';
import { WingetService } from '../../../services/winget/winget-service';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-winget-dialog',
  templateUrl: './winget-dialog.html',
  styleUrl: './winget-dialog.css',
  imports: [MatDialogContent, MatDialogActions],
})
export class WingetDialog {
  constructor(
    @Inject('data') public data: { packageName: string }
  ) { }

  protected readonly wingetService = inject(WingetService);
  private dialogRef = inject(MatDialog)

  detailPage() {
    if (this.data.packageName) {
      this.wingetService.wingetSpecificSearch(this.data.packageName);
    }
  }

  closeDialog() {
    const dilaog = this.dialogRef.closeAll()
  }

}
