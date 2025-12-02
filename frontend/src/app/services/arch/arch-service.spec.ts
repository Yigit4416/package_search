import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArchService } from "./arch-service"
// Ensure these imports match your actual file path
import { ArchPackage, ArchPackageQueryResponse, AurPackage, AurQueryResponse } from '../../../types/arch';

describe('ArchService', () => {
  let service: ArchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArchService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(ArchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ==========================================
  // 1. PACMAN TESTS
  // ==========================================
  describe('pacmanGeneralSearch', () => {
    it('should update pacmanGeneralSearchResult signal on success', () => {
      const mockQuery = 'firefox';
      const mockPackages: ArchPackage[] = [{ pkgname: 'firefox', pkgver: '120.0' } as unknown as ArchPackage];
      const mockResponse: ArchPackageQueryResponse = { data: mockPackages } as unknown as ArchPackageQueryResponse;

      service.pacmanGeneralSearch(mockQuery);

      expect(service.loading()).toBeTruthy();
      expect(service.error()).toBeNull();

      const req = httpMock.expectOne(`http://localhost:3000/api/arch/pacman/search?query=${mockQuery}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      expect(service.pacmanGeneralSearchResult()).toEqual(mockPackages);
      expect(service.loading()).toBeFalsy();
    });

    it('should handle 404 errors', () => {
      service.pacmanGeneralSearch('unknown');
      const req = httpMock.expectOne((req) => req.url.includes('/api/arch/pacman/search'));
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(service.pacmanGeneralSearchResult()).toEqual([]);
      expect(service.error()).toBe('no packages found.');
      expect(service.loading()).toBeFalsy();
    });
  });

  describe('pacmanSpecificPackage', () => {
    it('should update pacmanSpecificPackageResult signal on success', () => {
      const mockQuery = 'firefox';
      const mockPackage: ArchPackage = { pkgname: 'firefox' } as unknown as ArchPackage;

      service.pacmanSpecificPackage(mockQuery);

      expect(service.loading()).toBeTruthy();

      const req = httpMock.expectOne(`http://localhost:3000/api/arch/pacman/package/${mockQuery}`);
      req.flush(mockPackage);

      expect(service.pacmanSpecificPackageResult()).toEqual(mockPackage);
      expect(service.loading()).toBeFalsy();
    });

    it('should handle 400 errors', () => {
      service.pacmanSpecificPackage('bad-input');
      const req = httpMock.expectOne((req) => req.url.includes('/api/arch/pacman/package'));
      req.flush('Bad Request', { status: 400, statusText: 'Bad Req' });

      expect(service.pacmanSpecificPackageResult()).toBeNull();
      expect(service.error()).toBe('invalid search query.');
      expect(service.loading()).toBeFalsy();
    });
  });

  // ==========================================
  // 2. AUR TESTS
  // ==========================================
  describe('aurGeneralSearch', () => {
    it('should update aurGeneralSearchResult signal on success', () => {
      const mockQuery = 'yay';
      const mockResponse: AurQueryResponse = {
        resultcount: 1,
        results: [{ Name: 'yay', Version: '1.0' }]
      } as unknown as AurQueryResponse;

      // 1. Trigger
      service.aurGeneralSearch(mockQuery);

      // 2. Check loading
      expect(service.loading()).toBeTruthy();
      expect(service.error()).toBeNull();

      // 3. Expect Request
      const req = httpMock.expectOne(`http://localhost:3000/api/arch/aur/search?query=${mockQuery}`);
      expect(req.request.method).toBe('GET');

      // 4. Flush
      req.flush(mockResponse);

      // 5. Verify
      expect(service.aurGeneralSearchResult()).toEqual(mockResponse);
      expect(service.loading()).toBeFalsy();
    });

    it('should handle 404 errors', () => {
      service.aurGeneralSearch('ghost-package');

      const req = httpMock.expectOne(`http://localhost:3000/api/arch/aur/search?query=ghost-package`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(service.aurGeneralSearchResult()).toBeNull();
      expect(service.error()).toBe('no packages found.');
      expect(service.loading()).toBeFalsy();
    });
  });

  describe('aurSpecificPackage', () => {
    it('should update aurSpecificPackageResult signal on success', () => {
      const mockQuery = 'yay-bin';
      const mockPackage: AurPackage = { Name: 'yay-bin', Version: '1.0' } as unknown as AurPackage;

      service.aurSpecificPackage(mockQuery);

      expect(service.loading()).toBeTruthy();

      const req = httpMock.expectOne(`http://localhost:3000/api/arch/aur/package/${mockQuery}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockPackage);

      expect(service.aurSpecificPackageResult()).toEqual(mockPackage);

      // NOTE: This assertion will FAIL if you don't fix the finalize() bug in your service!
      expect(service.loading()).toBeFalsy();
    });

    it('should handle 500 errors', () => {
      service.aurSpecificPackage('broken-aur');

      const req = httpMock.expectOne(`http://localhost:3000/api/arch/aur/package/broken-aur`);
      req.flush('Server Error', { status: 500, statusText: 'Error' });

      expect(service.aurSpecificPackageResult()).toBeNull();
      expect(service.error()).toContain('an unexpected error occurred');
      expect(service.loading()).toBeFalsy(); // Again, this checks for the fix
    });
  });
});
