import { Validatable, PropertyValidations } from '../vadacl/interfaces'

export class Company implements Validatable {
    name: string = null;
    city: string = null;
    state: string = null;
    zip: string = null;

    /*
     The messages for the validations below are configured in locale-vadacl/messages-en.ts.  The copies of the Vadacl and
     ValidationMethod classes in the locale-vadacl folder will be used to validate this object in order to demonstrate
     locale-based messages (rather than polluting the regular vadacl local messages with messages for a demo class).
    */
    validations: {
        name: PropertyValidations,
        city: PropertyValidations,
        state: PropertyValidations,
        zip: PropertyValidations
    } = {
        name: {
            required: {},
            pattern: { pattern: '[a-zA-Z]+' }
        },
        city: {
            required: {},
            minLength: { minLength: 2 }
        },
        state: {
            required: { message: 'You must enter a state.' }, //Domain-level messages override the locale message
            pattern: { pattern: '[A-Z]{2}'}
        },
        zip: {
            required: {},
            pattern: { pattern: '[0-9]{5}' }
        }
    };

    /*
     A convenient way to set the properties on a domain class, as long as the properties are set with some sort
     of initial value.
     */
    constructor( companyData?: any ) {
        if( companyData ) {
            let props = Object.keys( this );
            for( let p in props ) {
                if( companyData[ props[p] ] ) {
                    this[ props[p] ] = companyData[ props[p] ];
                }
            }
        }
    }
}
