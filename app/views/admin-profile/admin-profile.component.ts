
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserProfile } from '../../domain/user-profile';
import { Vadacl } from '../../vadacl/vadacl';

@Component({
    moduleId: module.id,
    selector: 'views-admin-profile',
    templateUrl: 'admin-profile.component.html'
})

export class AdminProfileComponent extends Vadacl implements OnInit {

    pageReady: boolean = false;
    formSubmitted: boolean = false;
    profileForm: FormGroup;
    userProfile: UserProfile;

    constructor() {
        super();
    }

    ngOnInit() {
        this.userProfile = new UserProfile();

        let componentValidations = {
            firstName: {
                required: { message: 'The firstName field is required.'}
            },
            lastName: {
                required: { message: 'The lastName field is required.'}
            },
            username: {
                minLength: { minLength: 3, message: 'The username must be at least 3 characters long.' }
            }
        };

        this.profileForm = new FormGroup({
            'firstName': new FormControl(
                this.userProfile.firstName,
                this.applyRules( this.userProfile, 'firstName', componentValidations.firstName )
            ),
            'lastName': new FormControl(
                this.userProfile.lastName,
                this.applyRules( this.userProfile, 'lastName', componentValidations.lastName )
            ),
            'username': new FormControl(
                this.userProfile.username,
                this.applyRules( this.userProfile, 'username', componentValidations.username )
            ),
            'age': new FormControl(
                this.userProfile.age,
                this.applyRules( this.userProfile, 'age' )
            ),
            'gender': new FormControl(
                this.userProfile.gender,
                this.applyRules( this.userProfile, 'gender' )
            )
        });

        this.pageReady = true;
    }

    resetForm() {
        this.profileForm.reset();
        this.formSubmitted = false;
    }

    submitForm() {
        this.formSubmitted = true;
    }

}