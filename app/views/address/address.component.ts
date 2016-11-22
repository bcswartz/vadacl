import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Vadacl as VadaclService } from '../../vadacl/vadacl';

@Component({
    moduleId: module.id,
    selector: 'views-addresss',
    templateUrl: 'address.component.html'
})

export class AddressComponent implements OnInit {
    pageReady: boolean = false;
    formSubmitted: boolean = false;
    addressForm: FormGroup;

    address: any;

    /*
     This component, instead of extending the Vadacl class, uses it as an injected service
     */
    constructor( private vService: VadaclService) { }

    ngOnInit() {
        this.createDomainObject();
        this.buildForm();
        this.pageReady = true;
    }

    buildForm() {

        /*
         The address object has no domain-level/pre-defined validations, so all of the following validations are brand-new.
         */
        let addressValidations = {
            street: { required: { message: 'Please enter the street address.' } },
            /*
             Even though the address object has no pre-defined validations, the required validation rule will still
             inherit the default validation message returned by the required validator.
             */
            city: { required: {} },
            state: {
                required: { message: 'Please enter the 2-letter state.' },
                pattern: { pattern: '[A-Z]{2}', message: 'The state value should be 2 capitalized letters.' }
            },
            zipCode: {
                pattern: { pattern: '[0-9]{5}', message: '5-digit zip codes only, please.' }
            }
        };

        this.addressForm = new FormGroup( {
            'street': new FormControl( this.address.street, this.vService.applyRules( this.address, 'street', addressValidations.street ) ),
            'city': new FormControl( this.address.city, this.vService.applyRules( this.address, 'city', addressValidations.city ) ),
            'state': new FormControl( this.address.state, this.vService.applyRules( this.address, 'state', addressValidations.state ) ),
            'zipCode': new FormControl( this.address.zip, this.vService.applyRules( this.address, 'zip', addressValidations.zipCode ) )
        });
    }

    /*
     Illustrates the face that vadacl can be used with domain/data objects represented by simple object literals
     */
    createDomainObject() {
        this.address = {
            street: '',
            city: '',
            state: '',
            zip: ''
        }
    };

    resetForm() {
        this.addressForm.reset();
        this.formSubmitted = false;
    }

    submitForm() {
        this.formSubmitted = true;
    }
}
