
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Company } from '../../domain/company';
import { EnterpriseCompany } from '../../domain/enterprise-company';

/*
 Importing copy of Vadacl from locale-vadacl in order to use the class locale validation messages.  The locale copy of Vadacl provides a demonstration
 of the use of class locale messages without polluting the messages in the Vadacl folder meant for installation in projects with class error messages
*/
import { Vadacl } from '../../locale-vadacl/vadacl';

@Component({
    moduleId: module.id,
    selector: 'views-company',
    templateUrl: 'company.component.html'
})

export class CompanyComponent extends Vadacl implements OnInit {

    pageReady: boolean = false;
    formSubmitted: boolean = false;
    companyForm: FormGroup;
    company: Company;

    constructor() {
        super();
    }

    ngOnInit() {
        //this.company = new Company();
        this.company = new EnterpriseCompany(); //switch with line above to get different set of messages for what is otherwise the same object

        this.companyForm = new FormGroup({
            'name': new FormControl(
                this.company.name,
                this.applyRules( this.company, 'name')
            ),
            'city': new FormControl(
                this.company.city,
                this.applyRules( this.company, 'city' )
            ),
            'state': new FormControl(
                this.company.state,
                this.applyRules( this.company, 'state' )
            ),
            'zip': new FormControl(
                this.company.zip,
                this.applyRules( this.company, 'zip' )
            )
        });

        this.pageReady = true;
    }

    resetForm() {
        this.companyForm.reset();
        this.formSubmitted = false;
    }

    submitForm() {
        this.formSubmitted = true;
    }

}
