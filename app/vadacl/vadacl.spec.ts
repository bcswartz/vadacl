import { Vadacl } from "./vadacl";
import { FormControl, FormGroup, FormArray } from "@angular/forms";

import { ValidationMethods } from './validation-methods';

describe( 'Vadacl', () => {
    let vadacl: Vadacl;

    beforeEach( () => {
        vadacl = new Vadacl();
    });

    describe( 'applyRules: ', () => {
        let domainClass: any;

        beforeEach( () => {
            domainClass = {
              firstName: 'Bob',
              validations: {
                  firstName: {
                      required: { message: 'is required' },
                      minLength: { minLength: 3, message: 'minLength of 3' }
                  }
              }
            };

        });

        describe( 'internal call to mergeValidations', () => {
            beforeEach( () => {
                spyOn( vadacl, 'mergeValidations' ).and.returnValue( {} );
                spyOn( vadacl, 'getValidatorArguments' ).and.returnValue( [] );
            });

            it( 'should receive an empty object literal object as first argument if no validations exist', () => {
                let emptyDomainClass = { companyName: 'Money Inc.'};
                vadacl.applyRules( emptyDomainClass, 'companyName' );
                expect( vadacl.mergeValidations ).toHaveBeenCalled();
                expect( vadacl.mergeValidations[ "calls" ].argsFor( 0 )[ 0 ]).toEqual( {} );
            });

            it( 'should receive an empty object literal object as first argument if no validations for property', () => {
                vadacl.applyRules( domainClass, 'companyName' );
                expect( vadacl.mergeValidations ).toHaveBeenCalled();
                expect( vadacl.mergeValidations[ "calls" ].argsFor( 0 )[ 0 ]).toEqual( {} );
            });

            it( 'should receive the property validations as the first argument', () => {
                vadacl.applyRules( domainClass, 'firstName' );
                expect( vadacl.mergeValidations ).toHaveBeenCalled();
                expect( vadacl.mergeValidations[ "calls" ].argsFor( 0 )[ 0 ]).toEqual( domainClass.validations.firstName );
            });

            it( 'should receive any validation overrides as the second argument', () => {
                vadacl.applyRules( domainClass, 'firstName', { maxLength: { maxLength: 10 }} );
                expect( vadacl.mergeValidations ).toHaveBeenCalled();
                expect( vadacl.mergeValidations[ "calls" ].argsFor( 0 )[ 0 ]).toEqual( domainClass.validations.firstName );
                expect( vadacl.mergeValidations[ "calls" ].argsFor( 0 )[ 1 ]).toEqual( { maxLength: { maxLength: 10 } } );
            });
        });

        describe( 'internal call to getValidatorArguments', () => {

            beforeEach( () => {
                spyOn( ValidationMethods, 'required' ).and.returnValue( function() { return 'required' } );
                spyOn( ValidationMethods, 'minLength' ).and.returnValue( function() { return 'minLength' } );

                spyOn( vadacl, 'getMethodDeclaredArguments' ).and.returnValue( [ 'minLength', 'message' ] );
                spyOn( vadacl, 'mergeValidations' ).and.returnValue( domainClass.validations.firstName );
                spyOn( vadacl, 'getValidatorArguments' ).and.returnValue( [] );
            });

            it( 'should receive the returned value of getMethodDeclaredArguments as the first argument', () => {
                vadacl.applyRules( domainClass, 'firstName' );
                expect( vadacl.getValidatorArguments ).toHaveBeenCalled();
                expect( vadacl.getValidatorArguments[ "calls" ].argsFor( 0 )[ 0 ]).toEqual( [ 'minLength', 'message' ] );
            });

            it( 'should receive the properties of the specified validation as the second argument', () => {
                vadacl.applyRules( domainClass, 'firstName' );
                expect( vadacl.getValidatorArguments ).toHaveBeenCalled();
                expect( vadacl.getValidatorArguments[ "calls" ].argsFor( 0 )[ 1 ]).toEqual( domainClass.validations.firstName.required );
                expect( vadacl.getValidatorArguments[ "calls" ].argsFor( 1 )[ 1 ]).toEqual( domainClass.validations.firstName.minLength );
            });
        });

        describe( 'should return', () => {
            beforeEach( () => {
                spyOn( vadacl, 'mergeValidations' ).and.callFake( ( base, overrides ) => {
                    if( overrides != undefined ) {
                        for( let setting in overrides ) {
                            base[ setting ] = overrides[ setting ]
                        }
                    }
                    return base;
                });

                spyOn( vadacl, 'getValidatorArguments' ).and.returnValue( [] );
            });


            describe( 'an empty array', () => {
                it( 'for a domain class with no properties', () => {
                    domainClass = {};
                    expect( vadacl.applyRules( domainClass, null ) ).toEqual( [] );
                });

                it( 'when no validations are defined', () => {
                    domainClass = { firstName: 'Bob' };
                    expect( vadacl.applyRules( domainClass, 'firstName' ) ).toEqual( [] );
                });

                it( 'when no validations are defined for the specified property name', () => {
                    domainClass = {
                        firstName: 'Bob',
                        validations: {
                            age: { required: { message: 'age required' } }
                        }
                    };

                    expect( vadacl.applyRules( domainClass, 'firstName' ) ).toEqual( [] );
                });

                it( 'when the specified property does not exist', () => {
                    expect( vadacl.applyRules( domainClass, 'notThere' ) ).toEqual( [] );
                });
            });

            describe( 'an array of functions', () => {
                beforeEach( () => {
                    spyOn( ValidationMethods, 'required' ).and.returnValue( function() { return 'required' } );
                    spyOn( ValidationMethods, 'maxLength' ).and.returnValue( function() { return 'maxLength' } );
                    spyOn( ValidationMethods, 'minLength' ).and.returnValue( function() { return 'minLength' } );
                });

                it( 'that align with the base validations when no overrides are provided', () => {
                    let validators = vadacl.applyRules( domainClass, 'firstName' );
                    expect( validators.length ).toEqual( 2 );
                    expect( validators[ 0 ]() ).toEqual( 'required' );
                    expect( validators[ 1 ]() ).toEqual( 'minLength' );
                });

                it( 'that reflect both base and override validations when provided', () => {
                    let overrides = { maxLength: { maxLength: 3, message: 'minLength of 3' } };
                    let validators = vadacl.applyRules( domainClass, 'firstName', overrides );
                    expect( validators.length ).toEqual( 3 );
                    expect( validators[ 0 ]() ).toEqual( 'required' );
                    expect( validators[ 1 ]() ).toEqual( 'minLength' );
                    expect( validators[ 2 ]() ).toEqual( 'maxLength' );
                });
            });

        });

    });

    describe( 'getMethodDeclaredArguments:', () => {
        let noArgumentFunction: any;
        let threeArgumentFunction: any;

        beforeEach( () => {
            noArgumentFunction = function() {
                return true;
            };

            threeArgumentFunction = function( minLength, maxLength, message ) {
                return true;
            };
        });

        it( 'should return an empty object literal if passed-in function has no arguments', () => {
            expect( vadacl.getMethodDeclaredArguments( noArgumentFunction ) ).toEqual( {} );
        });

        it( 'should return an object literal with key:value pairs of argument:position for each argument expected by passed-in function', () => {
            let methodArguments = vadacl.getMethodDeclaredArguments( threeArgumentFunction );
            expect( methodArguments.minLength ).toBeDefined();
            expect( methodArguments.minLength ).toEqual( 0 );
            expect( methodArguments.message ).toBeDefined();
            expect( methodArguments.message ).toEqual( 2 );
        });
    });

    describe( 'getValidatorArguments', () => {
        it( 'should return an empty array if no argument declarations are provided', () => {
            expect( vadacl.getValidatorArguments( {}, null ) ).toEqual( [] );
        });

        it( 'should copy provided validator arguments into the resulting array in the order dictated by function argument order', () => {
            let argumentDeclarations = { minLength: 0, maxLength: 1, message: 2 };
            let validatorArguments = { message: 'Length invalid', maxLength: 10, minLength: 5 };
            let finalArguments = vadacl.getValidatorArguments( argumentDeclarations, validatorArguments );

            expect( finalArguments.length ).toEqual( 3 );
            expect( finalArguments[ 0 ] ).toEqual( 5 );
            expect( finalArguments[ 1 ] ).toEqual( 10 );
            expect( finalArguments[ 2 ] ).toEqual( 'Length invalid' );
        });

        it( 'should set any function arguments not provided in the validator arguments to be set to null', () => {
            let argumentDeclarations = { minLength: 0, maxLength: 1, message: 2 };
            let validatorArguments = { maxLength: 10 };
            let finalArguments = vadacl.getValidatorArguments( argumentDeclarations, validatorArguments );

            expect( finalArguments.length ).toEqual( 3 );
            expect( finalArguments[ 0 ] ).toEqual( null );
            expect( finalArguments[ 1 ] ).toEqual( 10 );
            expect( finalArguments[ 2 ] ).toEqual( null );
        });

    });

    describe( 'mergeValidations:', () => {
        it( 'should return base validations if no overrides provided', () => {
            let baseValidations = { required: { message: 'Base message' } };
            let mergedValidations = vadacl.mergeValidations( baseValidations, null );
            expect( mergedValidations ).toEqual( baseValidations );
        });

        it( 'should add new override validations into merged validations', () => {
            let baseValidations = { required: { message: 'Base message' } };
            let overrideValidations = { minLength: { minLength: 2, message: 'minLength message'} };
            let mergedValidations = vadacl.mergeValidations( baseValidations, overrideValidations );
            expect( mergedValidations.required ).toBeDefined();
            expect( mergedValidations.minLength ).toBeDefined();
            expect( mergedValidations.minLength.minLength ).toEqual( 2 );
        });

        it( 'should modify base validations based on matching override validations', () => {
            let baseValidations = { maxLength: { maxLength: 8, message: 'maxLength base message' }, minLength: { minLength: 2 } };
            let overrideValidations = { maxLength: { message: 'Override message' }, minLength: { minLength: 4 } };
            let mergedValidations = vadacl.mergeValidations( baseValidations, overrideValidations );
            expect( mergedValidations.maxLength.maxLength ).toEqual( 8 );
            expect( mergedValidations.maxLength.message ).toEqual( 'Override message' );
            expect( mergedValidations.minLength.minLength ).toEqual( 4 );
        });
    });

    describe( 'showErrors:', () => {
        let formControl: FormControl;

        beforeEach( () => {
            formControl = new FormControl();
        });

        it( 'should always return false if form class is pristine', () => {
            formControl.markAsPristine();
            expect( vadacl.showErrors( formControl ) ).toEqual( false );
            expect( vadacl.showErrors( formControl, false ) ).toEqual( false );

            let formGroup = new FormGroup( { 'fc': formControl } );
            formGroup.markAsPristine();
            expect( vadacl.showErrors( formGroup ) ).toEqual( false );
            expect( vadacl.showErrors( formGroup, false ) ).toEqual( false );
        });

        it( 'should always return false if form class is valid', () => {
            expect( vadacl.showErrors( formControl ) ).toEqual( false );
            expect( vadacl.showErrors( formControl, false ) ).toEqual( false );

            let formArray = new FormArray( [ formControl ] );
            expect( vadacl.showErrors( formArray ) ).toEqual( false );
            expect( vadacl.showErrors( formArray, false ) ).toEqual( false );
        });

        it( 'by default, should return false if form class dirty and invalid but not touched', () => {
            formControl.markAsDirty();
            formControl.setErrors( { "required": true } );
            formControl.markAsUntouched();
            expect( vadacl.showErrors( formControl ) ).toEqual( false );

            formControl.markAsTouched();
            expect( vadacl.showErrors( formControl ) ).toEqual( true );
        });

        it( 'should return true if form class dirty and invalid and onlyAfterTouched set to false', () => {
            formControl.markAsDirty();
            formControl.setErrors( { "required": true } );
            formControl.markAsUntouched();
            expect( vadacl.showErrors( formControl, true ) ).toEqual( false );
            expect( vadacl.showErrors( formControl, false ) ).toEqual( true );
        });
    });

    describe( 'getControlErrors:', () => {
        let formControl: FormControl;

        beforeEach( () => {
            formControl = new FormControl();
            formControl.setErrors( { "required": { message: "A value is required." }, "minlength": { message: 'minLength error.' } } );
        });

        it( 'should return an empty array if no errors, regardless of dirty status or onlyWhenDirty argument', () => {
            formControl.setErrors( {} );
            expect( vadacl.getControlErrors( formControl ) ).toEqual( [] );

            formControl.markAsDirty();
            expect( vadacl.getControlErrors( formControl ) ).toEqual( [] );

            expect( vadacl.getControlErrors( formControl, false ) ).toEqual( [] );
        });

        it( 'by default, should return empty array if errors present but control is not dirty', () => {
            expect( vadacl.getControlErrors( formControl ) ).toEqual( [] );
        });

        it( 'should return array of errors if errors present and control is dirty', () => {
            formControl.markAsDirty();
            let errorArray = vadacl.getControlErrors( formControl );
            expect( errorArray.length ).toEqual( 2 );
            expect( errorArray[ 0 ] ).toEqual( 'A value is required.')
        });

        it( 'should return array of errors on pristine control if onlyWhenDirty argument set to false', () => {
            formControl.markAsPristine();
            let errorArray = vadacl.getControlErrors( formControl, false );
            expect( errorArray.length ).toEqual( 2 );
            expect( errorArray[ 1 ] ).toEqual( 'minLength error.')
        });

    });

    describe( 'changeControlValue:', () => {
        let formControl: FormControl;

        beforeEach( () => {
            formControl = new FormControl( 'initial value' );
        });

        it( 'by default, form control will be flagged as dirty and touched', () => {
            vadacl.changeControlValue( formControl, 'new value' );
            expect( formControl.value ).toEqual( 'new value' );
            expect( formControl.dirty ).toEqual( true );
            expect( formControl.touched ).toEqual( true );
        });

        it( 'the markTouched argument determines if the form control will be marked as touched', () => {
            vadacl.changeControlValue( formControl, 'new value A', false );
            expect( formControl.value ).toEqual( 'new value A' );
            expect( formControl.touched ).toEqual( false );

            vadacl.changeControlValue( formControl, 'new value B', true );
            expect( formControl.value ).toEqual( 'new value B' );
            expect( formControl.touched ).toEqual( true );
        });

    })
});

