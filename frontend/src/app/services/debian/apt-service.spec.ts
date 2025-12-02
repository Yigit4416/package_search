import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AptService } from "./apt-service"
import { AptSearchResult, DebianPackageInfo } from '../../../types/debian'; // Dosya yolunu kontrol et

describe('AptService', () => {
  let service: AptService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AptService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(AptService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generalSearch', () => {
    it('should update aptGeneralSearchResult signal on success', () => {
      const mockQuery = 'git';
      // Tip güvenliği için mock objesini cast ediyoruz
      const mockResponse: AptSearchResult = { 
        packages: [{ name: 'git', description: 'distributed version control' }] 
      } as unknown as AptSearchResult;

      service.generalSearch(mockQuery);

      expect(service.loading()).toBeTruthy();
      expect(service.error()).toBeNull();

      // Dikkat: Servis kodundaki URL'yi http://localhost:3000 olarak düzelttiğini varsayıyoruz
      const req = httpMock.expectOne(`http://localhost:3000/api/deb/apt/search?query=${mockQuery}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);

      expect(service.aptGeneralSearchResult()).toEqual(mockResponse);
      expect(service.loading()).toBeFalsy();
    });

    it('should handle 404 errors', () => {
      service.generalSearch('invalid-package');

      const req = httpMock.expectOne(`http://localhost:3000/api/deb/apt/search?query=invalid-package`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(service.aptGeneralSearchResult()).toBeNull();
      expect(service.error()).toBe('no packages found.');
      expect(service.loading()).toBeFalsy();
    });
  });

  describe('specificSearch', () => {
    it('should update aptSpecificResult signal on success', () => {
      const mockQuery = 'git';
      const mockPackage: DebianPackageInfo = { Package: 'git', Version: '2.34.1' } as unknown as DebianPackageInfo;

      service.specificSearch(mockQuery);

      expect(service.loading()).toBeTruthy();

      const req = httpMock.expectOne(`http://localhost:3000/api/deb/apt/package/${mockQuery}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockPackage);

      expect(service.aptSpecificResult()).toEqual(mockPackage);
      expect(service.loading()).toBeFalsy();
    });

    it('should handle 500 errors', () => {
      service.specificSearch('crashed-server');

      const req = httpMock.expectOne(`http://localhost:3000/api/deb/apt/package/crashed-server`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      expect(service.aptSpecificResult()).toBeNull();
      expect(service.error()).toContain('an unexpected error occurred');
      expect(service.loading()).toBeFalsy();
    });
  });
});
