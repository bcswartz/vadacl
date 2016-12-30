import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Vadacl } from '../../vadacl/vadacl';

@Component({
    moduleId: module.id,
    selector: 'views-excursion-package',
    templateUrl: 'excursion-package.component.html',
    styleUrls: [ 'excursion-package.component.css' ]
})

export class ExcursionPackageComponent extends Vadacl implements OnInit {

    pageReady: boolean = false;
    formSubmitted: boolean = false;
    packageForm: FormGroup;
    selectedPackage: any;
    packageArray: any;
    excursionArray: any;

    constructor() {
        super();
    }

    ngOnInit() {
        this.initializeData();
        this.buildForm();
    }

    updatePackage() {
        this.selectedPackage = this.packageArray[ ( this.packageForm.controls[ 'package' ].value - 1 ) ];
        this.setExcursionValidation();
        // After updating the validation logic, the validity of the FormArray must be re-checked.
        this.packageForm.controls[ 'excursions' ].updateValueAndValidity();
    }

    buildForm() {
        let excursionChoiceArray = new FormArray( [] );
        for( let ex in this.excursionArray ) {
            excursionChoiceArray.push( new FormControl( false ) );
        }
        this.packageForm = new FormGroup( {
            'package': new FormControl( this.selectedPackage.id ),
            'excursions': excursionChoiceArray
        });
        this.setExcursionValidation();
        this.pageReady = true;
    }

    // Updates the validation rule (including the validation message) based on the currently selected package.
    setExcursionValidation() {
        let excursionValidation = { 'withinTrueCount': {
            minCount: 0,
            maxCount: this.selectedPackage.count,
            message: `Based on the selected package, you can only select up to ${this.selectedPackage.count} excursions.` }
        };
        this.packageForm.controls[ 'excursions' ].setValidators( this.applyCollectionRule( null, null, excursionValidation ) );
    }

    initializeData() {
        this.packageArray = [
            { id: 1, name: 'Standard', price: '$0', count: 2 },
            { id: 2, name: 'Enhanced', price: '$200', count: 3 },
            { id: 3, name: 'Adventurer', price: '$500', count: 5 }
        ];

        this.selectedPackage = this.packageArray[ 0 ];

        this.excursionArray = [
            { id: 1, title: 'Dolphin cruise', label: 'a 3-hour cruise around Safin Island, with a chance to see dolphins and sea turtles.' },
            { id: 2, title: 'Guided jungle hike', label: 'a 3-hour tour of the west coast of Safin Island.' },
            { id: 3, title: 'Wanderlust Casino', label: 'have fun gambling in Wanderlust Casino.  $100 in gambling chips included.' },
            { id: 4, title: 'Parasailing', label: 'soar over the waters of Regalia Bay solo or with a companion.  Limited availability.' },
            { id: 5, title: 'Jetski session', label: 'spend 3 hours touring Regalia Bay on a jetski. Jetski training available.' },
            { id: 6, title: 'Genoa Wharf', label: 'spend 3 hours sightseeing and shopping in the historical wharf area of the island of Genoa.' }
        ];
    }

    resetForm() {
        this.packageForm.reset();
        // Manually reset the default package and the validation logic
        this.selectedPackage = this.packageArray[ 0 ];
        this.packageForm.controls[ 'package' ].setValue( this.selectedPackage.id );
        this.setExcursionValidation();
        this.packageForm.controls[ 'excursions' ].updateValueAndValidity();
        this.formSubmitted = false;
    }

    submitForm() {
        this.formSubmitted = true;
    }
}
