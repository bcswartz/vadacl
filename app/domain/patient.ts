import { Validatable, PropertyValidations } from '../vadacl/interfaces'

export class Patient implements Validatable {
    firstName: string = null;
    lastName: string = null;
    username: string = null;
    agreement: boolean = false;
    workingPercentage: number = null;
    playingPercentage: number = null;
    sleepingPercentage: number = null;

    validations: { firstName: PropertyValidations, lastName: PropertyValidations, username: PropertyValidations, agreement: PropertyValidations } = {
        /*
         Since no "message" property is set, both the minLength and required validation methods will utilize the
         default error message provided by the Messages import in the ValidationMethods class file (unless
         overridden at the component level).
         */
        firstName: {
            minLength: { minLength: 2 },
            required: { } //Since the "message" property is always optional, this is an empty object literal.
        },
        lastName: {
            minLength: { minLength: 2 },  //Again, the default validation error message will be used.
            required: { message: 'Your last name is required.' }
        },
        username: {
            withinLength: { minLength: 8, maxLength: 12, message: 'Must be 8-12 characters long.' }
        },
        agreement: {
            requiredTrue: { message: 'You must agree to allow us to use the information you provide for research purposes.'}
        }
    };

    constructor( userData?: any ) {
        /*
         A convenient way to set the properties on a domain class, as long as the properties are set with some sort
         of initial value.
         */
        if( userData ) {
           let props = Object.keys( this );
            for( let p in props ) {
                if( userData[ props[p] ] ) {
                   this[ props[p] ] = userData[ props[p] ];
                }
            }
        }
    }
}
