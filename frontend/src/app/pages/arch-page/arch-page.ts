import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { ArchService } from '../../services/arch/arch-service';
import { ActivatedRoute, Params } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

// --- DEĞİŞİKLİK 1: CDK Dialog yerine Material Dialog import et ---
// import { Dialog } from '@angular/cdk/dialog';  <-- SİL
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // <-- EKLE

import { AurDialog } from '../../components/dialogs/aur-dialog/aur-dialog';
import { PacmanDialog } from '../../components/dialogs/pacman-dialog/pacman-dialog';
import { CompactSearchComponent } from "../../components/compact-search/compact-search";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

// Ortak Tip Tanımı
export type UnifiedPackage = {
  uniqueId: string;
  realId: string | number;
  name: string;
  version: string;
  description: string;
  source: 'Official' | 'AUR';
  votes: number;
  popularity: number;
  isOutdated: boolean;
  repo?: string;
}

@Component({
  selector: 'app-arch-page',
  standalone: true,
  // --- DEĞİŞİKLİK 2: MatDialogModule'ü importlara ekle ---
  imports: [CompactSearchComponent, MatIcon, MatDialogModule],
  templateUrl: './arch-page.html',
  styleUrl: './arch-page.css',
})
export class ArchPage {
  // --- DEĞİŞİKLİK 3: inject(Dialog) yerine inject(MatDialog) kullan ---
  private dialog = inject(MatDialog);

  protected readonly archService = inject(ArchService)
  private readonly route = inject(ActivatedRoute)

  private readonly params: Signal<Params> = toSignal(this.route.params, {
    initialValue: {}
  })

  readonly packageName: Signal<string> = computed(() => this.params()['packagename'] ?? '')

  // --- AKILLI SIRALAMA ALGORİTMASI ---
  protected readonly allPackages: Signal<UnifiedPackage[]> = computed(() => {
    const query = this.packageName().trim().toLowerCase();
    const aurResult = this.archService.aurGeneralSearchResult()?.data ?? [];
    const pacmanResult = this.archService.pacmanGeneralSearchResult() ?? [];

    const mappedAur: UnifiedPackage[] = aurResult.map((pkg) => ({
      uniqueId: `aur-${pkg.ID}`,
      realId: pkg.ID,
      name: pkg.Name,
      version: pkg.Version,
      description: pkg.Description ?? '',
      source: 'AUR',
      votes: pkg.NumVotes ?? 0,
      popularity: pkg.Popularity ?? 0,
      isOutdated: pkg.OutOfDate !== null
    }));

    const mappedPacman: UnifiedPackage[] = pacmanResult.map((pkg) => ({
      uniqueId: `official-${pkg.pkgname}`,
      realId: pkg.pkgname,
      name: pkg.pkgname,
      version: pkg.pkgver,
      description: pkg.pkgdesc ?? '',
      source: 'Official',
      votes: 0,
      popularity: 0,
      isOutdated: pkg.flag_date !== null,
      repo: pkg.repo
    }));

    const combined = [...mappedPacman, ...mappedAur];

    if (!query) return combined;

    return combined
      .filter(pkg =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const scoreA = this.calculateScore(a, query);
        const scoreB = this.calculateScore(b, query);
        return scoreB - scoreA;
      });
  })

  constructor() {
    effect(() => {
      const currentPackage = this.packageName()
      if (!currentPackage) return;

      console.log('Searching for:', currentPackage)
      this.archService.aurGeneralSearch(currentPackage)
      this.archService.pacmanGeneralSearch(currentPackage)
    })
  }

  private calculateScore(pkg: UnifiedPackage, query: string): number {
    let score = 0;
    const name = pkg.name.toLowerCase();

    if (name === query) score += 10000;
    else if (name.startsWith(query)) score += 2000;
    else if (name.includes(`-${query}`) || name.includes(`${query}-`)) score += 1000;

    if (pkg.source === 'Official') {
      score += 1500;
    } else {
      score += (pkg.votes * 1.5);
      score += (pkg.popularity * 10);
    }

    score -= (name.length * 5);
    if (pkg.isOutdated) score -= 2000;

    return score;
  }

  openDetail(pkg: UnifiedPackage) {
    console.log('Opening detail for:', pkg.name);

    if (this.archService.loading()) return;

    const dialogConfig = {
      data: {
        packageName: pkg.realId
      },
      width: '90%',
      maxWidth: '650px',
      maxHeight: '90vh',
      autoFocus: false
    };

    if (pkg.source === 'AUR') {
      const aurPackages = this.archService.aurGeneralSearchResult()?.data || [];
      const originalPkg = aurPackages.find(p => p.ID === pkg.realId);

      this.dialog.open(AurDialog, {
        ...dialogConfig,
        data: {
          packageName: pkg.name, // Use name for the query, it's cleaner
          initialData: originalPkg
        }
      });
    } else {
      const pacmanPackages = this.archService.pacmanGeneralSearchResult() || [];
      const originalPkg = pacmanPackages.find(p => p.pkgname === pkg.realId);

      this.dialog.open(PacmanDialog, {
        ...dialogConfig,
        data: {
          packageName: pkg.name,
          initialData: originalPkg
        }
      });
    }
  }
}