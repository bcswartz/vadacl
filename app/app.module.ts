import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { routing } from './app.routing'
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './views/home/home.component';
import { PatientComponent } from './views/patient/patient.component';
import { AddressComponent } from './views/address/address.component';
import { CompanyNameComponent } from './views/company-name/company-name.component';
import { CustomerProfileComponent } from './views/customer-profile/customer-profile.component';
import { AdminProfileComponent } from './views/admin-profile/admin-profile.component';

import { Vadacl as VadaclService } from './vadacl/vadacl';


@NgModule({
    imports: [
        BrowserModule,
        routing,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        CustomerProfileComponent,
        AdminProfileComponent,
        PatientComponent,
        AddressComponent,
        CompanyNameComponent
    ],
    providers: [
        VadaclService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

