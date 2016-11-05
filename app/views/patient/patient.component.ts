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
        /*
         A single validation method can be applied to a FormGroup object.  This custom method checks to see if all of
         the percentage inputs add up to 100%.
         */
        function percentageValidation( formGroup: FormGroup ) {
            let total = 0;
            let controlNames = Object.keys( formGroup.controls );

            for( let cn in controlNames ) {
                let currentControl = formGroup.controls[ controlNames[cn] ];
                total += currentControl ? + currentControl.value : 0;
            }

            return total === 100 ? null : { 'percentageWrong': { message: 'The percentages must add up to 100.'} }
        }

        let percentageValidator: PropertyValidations = {
            pattern: { pattern: '^100$|^[1-9]{1}[0-9]{1}$|^[0-9]{1}$', message: 'Percentage must be a number between 0 and 100' }
        };

        this.percentageFormGroup = new FormGroup( {
            'working': new FormControl( null, this.applyRules( this.patient, 'workingPercentage', percentageValidator ) ),
            'playing': new FormControl( null, this.applyRules( this.patient, 'playingPercentage', percentageValidator ) ),
            'sleeping': new FormControl( null, this.applyRules( this.patient, 'sleepingPercentage', percentageValidator ) ),
        }, percentageValidation );

    }

    buildForm() {
        /*
         With this patient form, no changes are made to the withinLength validation applied to the username property at the
         domain class level, but this form does want the password to be required.
         */
        let usernameValidations = {
            required: { message: 'The username is required on this form.' }
        };

        this.patientForm = this.formBuilder.group( {
            'firstName': [ this.patient.firstName, this.applyRules( this.patient, 'firstName' ) ],
            'lastName': [ this.patient.lastName, this.applyRules( this.patient, 'lastName' )  ],
            'username': [ this.patient.username, this.applyRules( this.patient, 'username', usernameValidations )  ],
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

