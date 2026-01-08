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

/**
1. Standalone Component: The component is now standalone: true, which is modern Angular practice. It manages its own dependencies.

2. Efficient Change Detection: changeDetection: ChangeDetectionStrategy.OnPush tells Angular to only check for changes when its inputs change, an event occurs, or a signal it uses is updated. This improves performance.

 3. Accessing the Route: We inject ActivatedRoute, an Angular service that holds information about the current route.

4. Reactive Route Parameters:
  * toSignal(this.route.params) converts the route parameters Observable into a Signal. Signals are the new reactive primitive in Angular.
  * The result is stored in the params signal.

5. Deriving the Package Name:
  * computed(() => this.params()['packagename'] ?? '') creates a computed signal called packagename.
  * This packagename signal automatically re-evaluates whenever the params signal changes.
  * It extracts the packagename value from the route parameters. If packagename doesn't exist, it defaults to an empty string ('').

6. Logging Changes: The effect in the constructor will run whenever the packagename signal changes, logging the current value to the console. This is useful for debugging.

In short, packagename is now a signal that will always reflect the :packagename part of your URL, automatically updating whenever the route changes. You can use this packagename signal
directly in your component's template
 */

@Component({
  selector: 'app-winget-page',
  standalone: true,
  imports: [],
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
    if (!this.wingetService.loading()) {
      const dialog = this.dialgogRef.open(WingetDialog, {
        data: { packageName: selectedPackage },
        height: '400px',
        width: '600px',
      })
    }
  }
}
