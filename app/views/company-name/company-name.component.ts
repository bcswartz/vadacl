import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PropertyValidations } from '../../vadacl/interfaces';
import { Vadacl } from '../../vadacl/vadacl'

@Component({
    moduleId: module.id,
    selector: 'views-company-name',
    templateUrl: 'company-name.component.html'
})

export class CompanyNameComponent extends Vadacl implements OnInit {
    pageReady: boolean = false;
    formSubmitted: boolean = false;
    companyForm: FormGroup;

    company: any;

    constructor() {
        super();
    }

    ngOnInit() {
        this.createDomainObject();
        this.buildForm();
        this.pageReady = true;
    }

    buildForm() {
        let companyValidations: { [ index: string ]: PropertyValidations } = {
            companyName: {
                required: { message: 'Please enter a name for the company.' },
                minLength: { minLength: 5, message: 'The name must be at least 5 characters long.' },
                pattern: { pattern: '[a-zA-Z]+', message: 'The company name cannot contain numbers or spaces.' }
            }
        };

        this.companyForm = new FormGroup( {
            'companyName': new FormControl( null, this.applyRules( this.company, 'companyName', companyValidations[ 'companyName' ] ) )
        });
    }


    createDomainObject() {
        this.company = {
            companyName: ''
        }
    };

    setCompanyName( name: string ) {
        this.changeControlValue( this.companyForm.controls[ 'companyName' ], name );
    }

    resetForm() {
        this.companyForm.reset();
        this.formSubmitted = false;
    }

    submitForm() {
        this.formSubmitted = true;
    }
}
