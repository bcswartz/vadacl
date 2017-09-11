# This Repo Is Now Obsolete
 
A new version of vadacl, updated for Angular 4.x, has been published as an npm package:

[https://github.com/bcswartz/vadacl-npm](https://github.com/bcswartz/vadacl-npm)

An Angular CLI-powered Angular 4.x application that demonstrates the use of vadacl (an app based on the one in this
repo) is also available in a separate repo:

[https://github.com/bcswartz/vadacl-demo](https://github.com/bcswartz/vadacl-demo)

This repo will remain up for the time being.


## vadacl
vadacl ("validation at domain and component levels") is a small TypeScript library for Angular 2 that enhances the 
reactive form validation features provided in Angular 2.  It provides a means by which developers can set domain/database-based 
validation rules on data objects but then augment or override those validations as needed within different components.
It also lets developers add and override validation error messages that are added to the validation metadata returned 
by the validation methods.

## Explanation By Example

Imagine your Angular 2 applications serves two types of users:  customers and admin users.  Both types of users can edit
their own user profile, which your application retrieves from the corresponding UserProfile record in your database.
The UserProfile table contains the following columns:

* firstName (not nullable, maxlength 25 characters)
* lastName (not nullable, maxlength 25 characters)
* username (not nullable, maxlength 30 characters)
* age (nullable, integer)
* gender (nullable, single character: M or F)

Your application needs to apply the following (somewhat arbitrary) business rules regarding user profile data:

* Customers are required to provide values for the demographics fields (age, gender); admin users are not.
* Customer usernames must be at least 8 characters long; admin usernames can be as short as 3 characters.
* Customer and admins have separate components/forms for editing their user profile data.
* Validation errors should be display beneath the form inputs, and should be context-appropriate.

This is how you could implement validation with vadacl that addresses all of these validation and business rules:

Create a domain class with properties that will hold the data from the UserProfile database record retrieved by your application:

```javascript
export class UserProfile {
    firstName: string = null;
    lastName: string = null;
    username: string = null;
    age: number = null;
    gender: string = null;
}    
```

Now refactor the class to implement vadacl's Validatable interface, and add a "validations" property with validation settings
that adhere to the PropertyValidations interface and validation settings interfaces.  All of these interfaces are defined in 
the interfaces.ts file within the vadacl folder.  Now your UserProfile domain class looks like this:

```javascript
import { Validatable, PropertyValidations } from '../vadacl/interfaces'

export class UserProfile implements Validatable {
    firstName: string = null;
    lastName: string = null;
    username: string = null;
    age: number = null;
    gender: string = null;

    validations: { [ index: string ] : PropertyValidations } = {
        firstName: {
            maxLength: { maxLength: 25, message: 'Your first name cannot be longer than 25 characters.'},
            required: { message: 'Your first name is required.' }
        },
        lastName: {
            maxLength: { maxLength: 25, message: 'Your last name cannot be longer than 25 characters.'},
            required: { message: 'Your last name is required.' }
        },
        username: {
            maxLength: { maxLength: 30, message: 'Your username cannot be longer than 25 characters.'},
            required: { message: 'You must have a username.' }
        },
        age: {
            pattern: { pattern: '[0-9]*', message: 'Enter your age as an integer.' }
        },
        gender: {
            pattern: { pattern: 'M|F', message: 'Enter your gender as "M" or "F".' }
        }
    };
}    
```

In vadacl parlance, these validations are the "domain validations" referred to in the vadacl acronym.  They can also be
thought of as "persistence" validations:  if you send back UserProfile property values that don't adhere to these validation
rules back to your database to be saved/persisted, the save attempt will fail.  Such validation constraints should be
applied consistently throughout your application.

One quick note before moving on:  applying the interfaces is strictly optional, but doing so will help your IDE and 
TypeScript compiler alert you to any mistakes or omissions you may make in the validation settings.

Now create the CustomerProfileComponent that your customer users will use to edit their profile.  First, code the
component as if it was going to implement the form using Angular's reactive form controls in a standard manner (minus the
use of any Validators):

```javascript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserProfile } from '../../domain/user-profile';

@Component({
    moduleId: module.id,
    selector: 'views-customer-profile',
    templateUrl: 'customer-profile.component.html'
})

export class CustomerProfileComponent implements OnInit {

    pageReady: boolean = false;
    profileForm: FormGroup;
    userProfile: UserProfile;

    constructor() {}

    ngOnInit() {
        this.userProfile = new UserProfile();

        this.profileForm = new FormGroup({
            'firstName': new FormControl( this.userProfile.firstName ),
            'lastName': new FormControl( this.userProfile.lastName ),
            'username': new FormControl( this.userProfile.username ),
            'age': new FormControl( this.userProfile.age ),
            'gender': new FormControl( this.userProfile.gender )
        });

        this.pageReady = true;
    }

}  
```

Now refactor the class to extend the Vadacl class, giving the class access to the methods in the vadacl.ts file.  Add 
the validation settings needed to implement the user profile business logic that applies to customer users, and then
configure the validation behavior for the form fields using that customer-specific business logic as needed via vadacl's
applyRules() method:

```javascript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserProfile } from '../../domain/user-profile';
import { Vadacl } from '../../vadacl/vadacl';

@Component({
    moduleId: module.id,
    selector: 'views-customer-profile',
    templateUrl: 'customer-profile.component.html'
})

export class CustomerProfileComponent extends Vadacl implements OnInit {

    pageReady: boolean = false;
    profileForm: FormGroup;
    userProfile: UserProfile;

    constructor() {
        super();
    }

    ngOnInit() {
        this.userProfile = new UserProfile();
        
        let componentValidations = {
            username: { 
                minLength: { minLength: 8, message: 'Your username must be at least 8 characters long.' }
            },
            age: {
                required: { message: 'You must provide your age.' }
            },
            gender: {
                required: { message: 'You must provide your gender.' }
            }
        }

        this.profileForm = new FormGroup({
            'firstName': new FormControl(
                this.userProfile.firstName,
                this.applyRules( this.userProfile, 'firstName')
            ),
            'lastName': new FormControl(
                this.userProfile.lastName,
                this.applyRules( this.userProfile, 'lastName' )
            ),
            'username': new FormControl(
                this.userProfile.username,
                this.applyRules( this.userProfile, 'username', componentValidations.username )
            ),
            'age': new FormControl(
                this.userProfile.age,
                this.applyRules( this.userProfile, 'age', componentValidations.age )
            ),
            'gender': new FormControl(
                this.userProfile.gender,
                this.applyRules( this.userProfile, 'gender', componentValidations.gender )
            )
        });

        this.pageReady = true;
    }

}
```

The applyRules() method of the Vadacl class is the heart of vadacl.  It uses the domain object and property name arguments
to obtain the validation rules for that property set in the data object, then adds to or overrides those settings with any
new validation settings provided in the 3rd argument.  It then uses that combination of domain validation settings and
component-level validation settings to produce an array of validator methods that can be returned as the 2nd argument to 
the FormControl constructor.

(The Vadacl class also contains a similar method, the applyCollectionRule() method, that 
performs the same function for applying a single validation method to a FormGroup or FormArray collection of FormControls)

The AdminProfileComponent used to let admin users edit their user profile would be constructed in a similar way, but 
would apply a different set of component-level validation settings:

```javascript
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
``` 

If combining domain and component-level validations is vadacl's primary purpose, then management of the validation error
messages is its secondary purpose.  Even though the same domain-level validation rules are applied, the error messages
for those rules can be altered via the component validation settings to fit the context.

vadacl also allows you to configure the validation messages within a locale-based Messages object.  This object contains
two different sets of message configurations:

* Default validation method messages: generic messages returned for the given validation method if you don't provide 
error message text in either the domain-level validation settings, the component-level settings, or locale-based domain
class validations (see next bullet).

* Locale-based domain class validation messages (added with release 0.1.0): specific messages for a given domain 
class / property / validation error.  Provides an alternative to defining the error messages amongst the validation 
settings in the domain class, allowing you to keep all of the messages in one place and to swap sets of messages at 
build time by targeting a different file.  These messages can still be overridden at both the domain and component levels.

The following Messages object (imported by the ValidationMethods class) provides examples of both sets:

```javascript
let Messages = {

    /* DEFAULT LOCALE VALIDATOR ERROR MESSAGES */
    required: 'A value is required',
    minlength: 'The value is too short.',
    maxlength: 'The value is too long.',
    pattern: 'The value does not match the pattern.',
    withinlength: 'The value does not meet the size requirements',


    /* LOCALE-BASED DOMAIN CLASS MESSAGES */
    Company: {
        name: {
            required: 'Please enter a name for the company.',
            pattern: 'The company name cannot contain letters or spaces.'
        },
        city: {
            required: 'Please enter the city the company is based in.',
            minlength: 'The city name must be at least 2 characters long.'
        },
        state: {
            required: 'Please enter the state the company is based in.',
            pattern: 'The state should be a 2-letter capitalized abbreviation.'
        },
        zip: {
            required: 'Please enter the zip code the company is based in.',
            pattern: 'Please enter the zip as a 5-digit code.'
        }
    },

    /*
     By extending Company class as a class with a different name, you can create different validation messages for a
     different usage of what is essentially the same class.
    */
    EnterpriseCompany: {
        name: {
            required: 'Please enter a name for the enterprise.',
            pattern: 'The enterprise name cannot contain letters or spaces.'
        },
        city: {
            required: 'Please enter the city the enterprise is based in.',
            minlength: 'The enterprise name must be at least 2 characters long.'
        }
        //The state and zip validation messages will fall back to the locale validation message defaults
    }
};
``` 
Note the fact that validation property names are all in lowercase, not camelCase like the method names.  They match the 
key name of the metadata object returned by the validation method when the value is invalid.

The Vadacl class also includes methods that assist with the task of displaying the validation error messages in the 
component template, eliminating the need to conditionally display different DOM elements for different validation errors:

```
<input id="firstName" type="text" class="form-control" formControlName="firstName">
<div *ngIf="pageReady && showErrors( profileForm.controls.firstName )" class="alert alert-danger">
    <ul>
        <li *ngFor="let error of getControlErrors( profileForm.controls.firstName )">
            {{error}}
        </li>
    </ul>
</div>
```

[Click to view admin profile form screenshot](docs/adminProfileErrors.png)

## Validation Methods

The ValidationMethods class of vadacl includes validation methods that either mimic or wrap the Validator methods 
provided by Angular as of version 2.4.1:

* required
* requiredTrue
* minLength
* maxLength
* pattern

It also includes the following additional validation methods:

* "withinLength": Validates that the length of the value of the AbstractControl falls within a certain range.  Like
the minLength and maxLength methods, it can be used to validate the length of a string or the number of form controls 
in a FormGroup or FormArray.

* "totals": Validates that the sum of the numeric values of the FormGroup or FormArray controls equals a certain amount.

* "equalValues": Validates that all of the values of the FormControls within a FormGroup or FormArray are exactly equal. 
Useful for performing password confirmation.

* "withinTrueCount": Validates that the number of FormControls within a FormGroup or FormArray with a value of Boolean 
true falls within a given range.  Designed primarily to validate how many checkboxes are checked.

You can also add your own validation methods in three simple steps:

1. In interfaces.ts, create an interface for the settings for your validation method and add it to the PropertyValidations
interface.
2. Create a default message for your validation method in any/all of your Message object files.
3. Add the validation method to the ValidationMethods class.


### Other Features

* If you don't want to write your components to extend the Vadacl class, you can declare the Vadacl class as a provider
in the appropriate Angular module(s) and inject it into your components like any other service.

* You can keep the regular expression patterns for particular validations (email addresses, website URLs, etc.) in the 
Patterns module incorporated in the vadacl architecture.

## Internationalization (i18n)

The official documentation regarding [internationalization in Angular 2](https://angular.io/docs/ts/latest/cookbook/i18n.html)
explains how fragments of text (sentences, phrases) can be replaced with the equivalent text for another language by tagging
the DOM element containing the fragment with the "i18n" custom attribute as per the instructions, and performing the 
language swap at compile time.

You can follow that model for implementing i18n while still using vadacl by not providing your validation messages via 
vadacl, but rather by DOM elements conditionally displayed based on the type of validation error:

```
<ul>
    <li *ngIf="companyForm.controls.zip.errors.required" i18n="...">
        Postal code is required.
    </li>
    <li *ngIf="companyForm.controls.zip.errors.pattern" i18n="...">
        Postal code does not fit the pattern.
    </li>
</ul>
```

Alternatively, you could define different locale-based domain class validation messages for different languages using 
different source files for the Messages object, and simply add a pre-compile step in your build process that would alter 
which file was used as the Messages import in the validation-methods.ts file based on the desired language.
In that scenario, you might still end up using DOM element-based messages like in the preceding example when messages 
need to be altered at a component level.

## Usage, Execution, and Testing Instructions

**Using vadacl in your project**

To use vadacl, simply download or checkout this repo, then copy the app/vadacl folder into your own project.  If you're
unsure about how to apply certain validations, look at the code in the demos (either here in the repo or in the downloaded
code)for guidance.

**Trying out vadacl**

This repo contains an Angular 2 application (currently Angular 2.1.1) with several demos that utilize vadacl.  So to try
out vadacl, download or checkout the repo, open a command prompt in the main project folder, run "npm install" to get 
the needed Node modules to run Angular, and run the application using "npm start."

Note that the most of the demos display the validation errors based on the default configuration, meaning that the errors are not
displayed until the invalid field is marked as both dirty and touched (had and then lost focus).

**Testing vadacl**

The vadacl folder contains Jasmine unit tests for the Vadacl and ValidationMethod classes.  The repo includes packages 
and configuration files for running the tests via Karma. To execute the tests, open a command prompt in 
the main project folder, run "npm install" to get the needed Node modules, and then run "npm test".

## Release Notes

### 0.2.0

* Added applyCollectionRule method to Vadacl class to apply a single validation method to a FormArray or FormGroup.
* Updated pattern validation method to accept both string and RexExp pattern arguments (to match current Angular pattern Validator).
* Added requiredTrue validation method that mimics recently-added Angular requiredTrue Validator.
* Made minor logic enhancement to applyRules Vadacl method.
* Added three validation methods specifically for FormGroup and FormArray validation:  totals, equalValues, and withinTrueCount.
* Added and updated demos to demonstrate new validation methods.
* Updated demo codebase to Angular 2.4.1.

### 0.1.0

* Added support for defining locale-based domain class messages in the Messages object.

### 0.0.2

* Added unit tests for Vadacl and ValidationMethod classes.

### 0.0.1

* Initial release


## Feature Roadmap

Currently the roadmap for improving vadacl includes the following items:

* Possibly refactoring the classes and objects to make it easier for developers to upgrade their instance of vadacl 
without losing any of their custom validation methods.