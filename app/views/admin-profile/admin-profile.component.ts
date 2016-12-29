
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
            },
            passwordGroup: {
                equalValues: { message: 'The password values must be the same.' }
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
            'passwordGroup': new FormGroup(
                {
                    'password': new FormControl(
                        this.userProfile.password,
                        this.applyRules( this.userProfile, 'password' )
                    ),
                    'confirmPassword': new FormControl( null )
                },
                this.applyCollectionRule( null, null, componentValidations.passwordGroup )
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

    /*
     Prevents display of password mismatch validation error until both inputs have a value and
     the confirmPassword control has been touched.
     */
    passwordGroupModified() : boolean {
        let pswdValuesSet = false;
        let pswdControls = this.profileForm.controls[ 'passwordGroup' ][ 'controls' ];
        if( pswdControls.password.value && pswdControls.confirmPassword.value && pswdControls.confirmPassword.touched ) {
            pswdValuesSet = true;
        }
        return pswdValuesSet;
    }

    resetForm() {
        this.profileForm.reset();
        this.formSubmitted = false;
    }

    submitForm() {
        this.formSubmitted = true;
    }

}