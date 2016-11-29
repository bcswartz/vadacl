import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AddressComponent } from './views/address/address.component';
import { PatientComponent } from './views/patient/patient.component';
import { CompanyNameComponent } from './views/company-name/company-name.component';
import { CustomerProfileComponent } from "./views/customer-profile/customer-profile.component";
import { AdminProfileComponent } from './views/admin-profile/admin-profile.component';
import { CompanyComponent } from './views/company/company.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'customer-profile', component: CustomerProfileComponent },
    { path: 'admin-profile', component: AdminProfileComponent },
    { path: 'patient', component: PatientComponent },
    { path: 'address', component: AddressComponent },
    { path: 'company', component: CompanyComponent },
    { path: 'company-name', component: CompanyNameComponent }
];

export const routing = RouterModule.forRoot( appRoutes );
