import { Validatable, PropertyValidations } from '../vadacl/interfaces'

export class UserProfile implements Validatable {
    firstName: string = null;
    lastName: string = null;
    username: string = null;
    password: string = null;
    age: number = null;
    gender: string = null;

    /*
     Declaring a data type for the validations property is strictly optional, and how it is declared can affect how
     problems with the validation settings will be surfaced by an IDE that executes a TypeScript compiler.

     With the data type set as below, a compiler error should be thrown if any of the property validation settings
     don't conform to the settings interfaces.

     If however you explicitly set the type of each validations property as PropertyValidations:

     validations: { firstName: PropertyValidations, lastName: PropertyValidations, etc.. } = ...

     ...then your IDE may also highlight any typos in the settings key names.
     */
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
        password: {
            minLength: { minLength: 6, message: 'Your password must be at least 6 characters long.' },
            required: { message: 'You must provide a password.' },
        },
        age: {
            pattern: { pattern: '[0-9]*', message: 'Enter your age as an integer.' }
        },
        gender: {
            pattern: { pattern: 'M|F', message: 'Enter your gender as "M" or "F".' }
        }
    };

    /*
     A convenient way to set the properties on a domain class, as long as the properties are set with some sort
     of initial value.
     */
    constructor( userProfileData?: any ) {
        if( userProfileData ) {
           let props = Object.keys( this );
            for( let p in props ) {
                if( userProfileData[ props[p] ] ) {
                   this[ props[p] ] = userProfileData[ props[p] ];
                }
            }
        }
    }
}
