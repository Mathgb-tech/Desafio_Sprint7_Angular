import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { VehicleService, Vehicle, VehicleData } from '../../core/services/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;

  vinSearchTerm = '2FRHDUYS2Y63NHD22454';
  private vinSearch$ = new Subject<string>();
  selectedVehicleData: VehicleData | null = null;
  vinErrorMessage = '';

  // Sample VIN list for helper links
  sampleVins = [
    '2FRHDUYS2Y63NHD22454',
    '2RFAASDY54E4HDU34874',
    '2FRHDUYS2Y63NHD22455',
    '2RFAASDY54E4HDU34875',
    '2FRHDUYS2Y63NHD22654',
    '2FRHDUYS2Y63NHD22854'
  ];

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();

    this.vinSearch$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      filter(term => term !== null && term.trim().length > 0),
      map(term => term.trim())
    ).subscribe({
      next: (vin) => {
        this.loadVehicleData(vin);
      }
    });

    this.loadVehicleData(this.vinSearchTerm);
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        if (this.vehicles.length > 0) {
          this.selectVehicle(this.vehicles[0]);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar veículos', err);
      }
    });
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
  }

  onVehicleSelectChange(event: any): void {
    const vehicleId = Number(event);
    const foundVehicle = this.vehicles.find(v => v.id === vehicleId);
    if (foundVehicle) {
      this.selectVehicle(foundVehicle);
    }
  }

  onVinSearchChange(value: string): void {
    this.vinSearchTerm = value;
    this.vinSearch$.next(value);
  }

  searchVin(): void {
    if (this.vinSearchTerm.trim()) {
      this.loadVehicleData(this.vinSearchTerm.trim());
    }
  }

  loadVehicleData(vin: string): void {
    this.vinErrorMessage = '';
    this.vehicleService.getVehicleData(vin).subscribe({
      next: (data) => {
        this.selectedVehicleData = data;
      },
      error: (err) => {
        this.selectedVehicleData = null;
        this.vinErrorMessage = err.error?.message ?? 'Código VIN utilizado não foi encontrado!';
      }
    });
  }

  selectSampleVin(vin: string): void {
    this.vinSearchTerm = vin;
    this.loadVehicleData(vin);
  }

  onLogout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }
}