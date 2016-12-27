import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Patient } from '../../domain/patient';
import { Vadacl } from '../../vadacl/vadacl';
import { PropertyValidations } from "../../vadacl/interfaces";

@Component({
    moduleId: module.id,
    selector: 'views-patient',
    templateUrl: 'patient.component.html'
})

export class PatientComponent extends Vadacl implements OnInit {

    pageReady: boolean = false;
    formSubmitted: boolean = false;
    patientForm: FormGroup;
    percentageFormGroup: FormGroup;

    patient: Patient;

    constructor( private formBuilder: FormBuilder ) {
        super();
    }

    ngOnInit() {
        this.createDomainObject();
        this.buildPercentageFormGroup();
        this.buildForm();
        this.pageReady = true;
    }

    /*
     The percentageFormGroup is a FormGroup class contained within the main patientForm FormGroup
     */
    buildPercentageFormGroup() {
        let percentageValidator: PropertyValidations = {
            pattern: { pattern: '^100$|^[1-9]{1}[0-9]{1}$|^[0-9]{1}$', message: 'Percentage must be a number between 0 and 100' }
        };

        /*
         Settings for the totals validation method, which was introduced in release 0.2.0.  Prior to that, a custom
         validation method for the percentageFormGroup was declared
         */
        let totalValidator: PropertyValidations = {
            totals: { total: 100, message: 'The percentages must total up to 100.' }
        };

        this.percentageFormGroup = new FormGroup({
            'working': new FormControl(null, this.applyRules(this.patient, 'workingPercentage', percentageValidator)),
            'playing': new FormControl(null, this.applyRules(this.patient, 'playingPercentage', percentageValidator)),
            'sleeping': new FormControl(null, this.applyRules(this.patient, 'sleepingPercentage', percentageValidator)),
        }, this.applyCollectionRule( null, null, totalValidator ) );

    }

    buildForm() {
        /*
         With this patient form, no changes are made to the withinLength validation applied to the username property at the
         domain class level, but this form does want the username to be required.
         */
        let usernameValidations = {
            required: { message: 'The username is required on this form.' }
        };

        this.patientForm = this.formBuilder.group( {
            'firstName': [ this.patient.firstName, this.applyRules( this.patient, 'firstName' ) ],
            'lastName': [ this.patient.lastName, this.applyRules( this.patient, 'lastName' )  ],
            'username': [ this.patient.username, this.applyRules( this.patient, 'username', usernameValidations )  ],
            'agreement': [ this.patient.agreement, this.applyRules( this.patient, 'agreement' ) ],
            'percentages': this.percentageFormGroup
        });
    }

    createDomainObject() {
        this.patient = new Patient( {
            firstName: 'Ronald',
            lastName: 'Devereux',
            username: 'redeverx'
        });
    };

    /*
     Prevents the display of the validation error for the percentages not equalling 100% until all the percentage
     inputs have a value
     */
    percentagesSet(): boolean {
        let percentagesSet = true;
        let controlNames = Object.keys( this.percentageFormGroup.controls );
        for( let cn in controlNames ) {
            let currentControl = this.percentageFormGroup.controls[ controlNames[cn] ];
            if( currentControl.value == null ) {
                percentagesSet = false
            }
        }
        return percentagesSet;
    }

    resetForm() {
        this.patientForm.reset();
        this.formSubmitted = false;
    }

    submitForm() {
        this.formSubmitted = true;
    }
}

