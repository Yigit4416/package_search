import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
} from '@angular/core';
import { WingetService } from '../../services/winget/winget-service';
import { ActivatedRoute, Params } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { WingetDialog } from '../../components/dialogs/winget-dialog/winget-dialog';
import { MatIcon } from "@angular/material/icon";
import { CompactSearchComponent } from "../../components/compact-search/compact-search";

@Component({
  selector: 'app-winget-page',
  standalone: true,
  imports: [MatIcon, CompactSearchComponent],
  templateUrl: './winget-page.html',
  styleUrl: './winget-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WingetPage {
  protected readonly wingetService = inject(WingetService);

  private dialgogRef = inject(MatDialog)

  private readonly route = inject(ActivatedRoute);
  private readonly params: Signal<Params> = toSignal(this.route.params, {
    initialValue: {},
  });
  // Matches the ':packagename' in your route
  readonly packagename: Signal<string> = computed(() => this.params()['packagename'] ?? '');

  constructor() {
    effect(() => {
      const currentPackage = this.packagename();
      console.log(currentPackage);
      this.wingetService.wingetGeneralSearch(currentPackage);
    });
  }

  detailPage(selectedPackage: string) {
    console.log(selectedPackage)
    if (!this.wingetService.loading()) {
      const dialogRef = this.dialgogRef.open(WingetDialog, {
        data: { packageName: selectedPackage },

        // 1. Responsive Width:
        // Occupy full width on mobile, but cap it at 650px on desktop
        width: '90%',
        maxWidth: '650px',

        // 2. Auto Height:
        // Remove 'height' property. Let the content dictate the height.
        // Add maxHeight to ensure it doesn't overflow the screen.
        maxHeight: '90vh',

        // 3. Optional: Prevent auto-focusing the first button (aesthetic choice)
        autoFocus: false
      });
    }
  }

  ngOnInit() {
    console.log(this.packagename())
    console.log(this.wingetService.wingetSearch())
  }
}
