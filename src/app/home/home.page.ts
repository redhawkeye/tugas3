import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

const API_URL = 'https://api.coinlore.net/api/tickers/';

export interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price_usd: string;
}

interface TickersResponse {
  data: Coin[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    DecimalPipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  private readonly http = inject(HttpClient);

  readonly coins = signal<Coin[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCoins();
  }

  loadCoins(done?: () => void): void {
    this.error.set(null);
    this.http.get<TickersResponse>(API_URL).subscribe({
      next: (response) => {
        this.coins.set(response.data ?? []);
        this.loading.set(false);
        done?.();
      },
      error: () => {
        this.error.set('Gagal mengambil data. Periksa koneksi internet Anda.');
        this.loading.set(false);
        done?.();
      },
    });
  }

  retry(): void {
    this.loading.set(true);
    this.loadCoins();
  }

  refresh(event: Event): void {
    const refresher = event.target as HTMLIonRefresherElement;
    this.loadCoins(() => refresher.complete());
  }

  // Koin murah (di bawah $1) ditampilkan dengan lebih banyak angka desimal.
  priceFormat(price: string): string {
    return Number(price) >= 1 ? '1.2-2' : '1.2-6';
  }
}
