import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load coins from the API', () => {
    httpMock.expectOne('https://api.coinlore.net/api/tickers/').flush({
      data: [{ id: '90', rank: 1, name: 'Bitcoin', symbol: 'BTC', price_usd: '64663.13' }],
    });

    expect(component.loading()).toBe(false);
    expect(component.coins().length).toBe(1);
    expect(component.coins()[0].name).toBe('Bitcoin');
  });
});
