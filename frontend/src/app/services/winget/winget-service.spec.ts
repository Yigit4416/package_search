import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WingetService } from './winget-service'; // Ensure this path matches your file structure
import { WingetPackage, WingetQueryResponse } from '../../../types/winget'; // Adjust path
import { environment } from '../../../environments/environment';

describe('WingetService', () => {
  let service: WingetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        // 1. Provide the Service
        WingetService,
        // 2. Provide the modern HTTP testing tools
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(WingetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // 3. Cleanup: Ensure no pending HTTP requests remain after each test
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('wingetGeneralSearch', () => {
    it('should update wingetSearch signal on success', () => {
      const mockQuery = 'vscode';
      // Note: If your actual code uses pkg.Latest.Name, you might need to nest this in the mock
      const mockPackages: WingetPackage[] = [
        { Id: 'Microsoft.VSCode', Name: 'Visual Studio Code' } as unknown as WingetPackage,
      ];
      const mockResponse: WingetQueryResponse = { data: { Packages: mockPackages } } as any;

      // 1. Trigger the search
      service.wingetGeneralSearch(mockQuery);

      // 2. Expect loading to be true immediately
      expect(service.loading()).toBeTruthy();
      expect(service.error()).toBeNull();

      // 3. Expect an HTTP request to the specific URL
      const req = httpMock.expectOne(`${environment.apiUrl}/winget/search?query=${mockQuery}`);
      expect(req.request.method).toBe('GET');

      // 4. Flush (respond) with mock data
      req.flush(mockResponse);

      // 5. Assertions after response
      expect(service.wingetSearch()).toEqual(mockPackages);
      expect(service.loading()).toBeFalsy();
    });

    it('should handle 404 errors correctly', () => {
      service.wingetGeneralSearch('unknown-app');

      const req = httpMock.expectOne(`${environment.apiUrl}/winget/search?query=unknown-app`);

      // Simulate a 404 error
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(service.wingetSearch()).toEqual([]); // Should clear results
      expect(service.error()).toBe('no packages found.');
      expect(service.loading()).toBeFalsy();
    });
  });

  describe('wingetSpecificSearch', () => {
    it('should update wingetPackageSpecific signal on success', () => {
      const mockId = 'Microsoft.VSCode';
      const mockPackage: WingetPackage = {
        Id: mockId,
        Name: 'Visual Studio Code',
      } as unknown as WingetPackage;

      service.wingetSpecificSearch(mockId);

      expect(service.loading()).toBeTruthy();

      const req = httpMock.expectOne(`${environment.apiUrl}/winget/package/${mockId}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockPackage);

      expect(service.wingetPackageSpecific()).toEqual(mockPackage);
      expect(service.loading()).toBeFalsy();
    });

    it('should handle 400 Bad Request errors', () => {
      service.wingetSpecificSearch('invalid/id');

      const req = httpMock.expectOne(`${environment.apiUrl}/winget/package/invalid/id`);

      // Simulate a 400 error
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

      expect(service.wingetPackageSpecific()).toBeNull();
      expect(service.error()).toBe('invalid search query.');
      expect(service.loading()).toBeFalsy();
    });

    it('should handle generic 500 errors', () => {
      service.wingetSpecificSearch('broken-server');

      const req = httpMock.expectOne(`${environment.apiUrl}/winget/package/broken-server`);

      // Simulate a 500 error
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      expect(service.error()).toContain('an unexpected error occurred');
      expect(service.loading()).toBeFalsy();
    });
  });
});
