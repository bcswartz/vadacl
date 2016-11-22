import { FormControl, Validators } from '@angular/forms';
import { ValidationMethods } from './validation-methods';
import { Messages } from './messages/messages-en';

describe( 'ValidationMethods', () => {
    let formControl: FormControl;

    //Set default message values for testing
    Messages.required = 'default required message';
    Messages.minLength = 'default minLength message';
    Messages.maxLength = 'default maxLength message';
    Messages.pattern = 'default pattern message';
    Messages.withinLength = 'default withinLength message';

    beforeEach( () => {
        formControl = new FormControl( null );
    });

    describe( 'isEmpty:', () => {

        describe( 'should return true', () => {
            it( 'when FormControl value is null', () => {
               expect( ValidationMethods.isEmpty( formControl ) ).toEqual( true );
            });

            it( 'when FormControl value is undefined', () => {
                let undefinedVar: any;
                formControl.setValue( undefinedVar );
                expect( ValidationMethods.isEmpty( formControl ) ).toEqual( true );
            });

            it( 'when FormControl value is an empty string', () => {
                formControl.setValue( '' );
                expect( ValidationMethods.isEmpty( formControl ) ).toEqual( true );
            });
        });

        describe( 'should return false', () => {
            it( 'when FormControl value is present', () => {
                formControl.setValue( 'value' );
                expect( ValidationMethods.isEmpty( formControl ) ).toEqual( false );
            });

            it( 'when FormControl value is a non-empty string', () => {
                formControl.setValue( ' ' );
                expect( ValidationMethods.isEmpty( formControl ) ).toEqual( false );
            });
        });
    });

    describe( 'required:', () => {
        it( 'returns a validation function', () => {
            expect( ValidationMethods.required() ).toEqual( jasmine.any( Function ) );
        });
        describe( 'validation function', () => {
            let fn: any;

            beforeEach( () => {
                fn = ValidationMethods.required();
            });

            describe( 'returns null', () => {
                it( 'when FormControl has non-empty string value', () => {
                    formControl.setValue( ' ' );
                    expect( fn( formControl ) ).toBeNull();
                });

                it( 'when FormControl has value of 0', () => {
                    formControl.setValue( 0 );
                    expect( fn( formControl ) ).toBeNull();
                });
            });

            describe( 'returns error metadata object', () => {
                it( 'when FormControl value is null', () => {
                    let result = fn( formControl );
                    expect( result ).not.toBeNull();
                    expect( result.required ).toBeDefined();
                    expect( result.required.isEmpty ).toBeDefined();
                    expect( result.required.isEmpty ).toEqual( true );
                });

                it( 'when FormControl value is undefined', () => {
                    let undefinedValue: any;
                    formControl.setValue( undefinedValue );
                    let result = fn( formControl );
                    expect( result ).not.toBeNull();
                    expect( result.required ).toBeDefined();
                    expect( result.required.isEmpty ).toBeDefined();
                    expect( result.required.isEmpty ).toEqual( true );
                });

                it( 'when FormControl value is empty string', () => {
                    formControl.setValue( '' );
                    let result = fn( formControl );
                    expect( result ).not.toBeNull();
                    expect( result.required ).toBeDefined();
                    expect( result.required.isEmpty ).toBeDefined();
                    expect( result.required.isEmpty ).toEqual( true );
                });

                it( 'that uses default required message when no message argument is provided', () => {
                    let result = fn( formControl );
                    expect( result.required.message ).toEqual( Messages.required );
                });

                it( 'that uses message from argument in error metadata', () => {
                    let func = ValidationMethods.required( 'custom required message' );
                    let result = func( formControl );
                    expect( result.required.message ).toEqual( 'custom required message' );
                });
            });
        });
    });

    describe( 'minLength:', () => {

        it( 'returns a validation function', () => {
            expect( ValidationMethods.minLength( 0 ) ).toEqual( jasmine.any( Function ) );
        });

        describe( 'validation method', () => {
            let fn: any;

            beforeEach( () => {
                fn = ValidationMethods.minLength( 3 );
                spyOn( Validators, 'minLength' ).and.callThrough();
            });

            it( 'calls the official Angular 2 Validator.minLength', () => {
                fn( formControl );
                expect( Validators.minLength ).toHaveBeenCalled();
            });

            describe( 'returns null', () => {
                it( 'when FormControl value is null', () => {
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is undefined', () => {
                    let undefinedValue: any;
                    formControl.setValue( undefinedValue );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is empty string', () => {
                    formControl.setValue( '' );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl has string with length >= min length argument', () => {
                    formControl.setValue( '123' );
                    expect( fn( formControl ) ).toBeNull();

                    formControl.setValue( '1234' );
                    expect( fn( formControl ) ).toBeNull();
                });
            });

            describe( 'returns error metadata object', () => {

                beforeEach( () => {
                    formControl.setValue( '12' );
                });

                it( 'when FormControl has string with length < min length argument', () => {
                    let result = fn( formControl );
                    expect( result ).not.toBeNull();
                    expect( result.minlength ).toBeDefined();
                });

                it( 'with expected metadata properties', () => {
                    let result = fn( formControl );
                    expect( result.minlength.requiredLength ).toEqual( 3 );
                    expect( result.minlength.actualLength ).toEqual( 2 );
                });

                it( 'that uses default minLength message when no message argument is provided', () => {
                    let result = fn( formControl );
                    expect( result.minlength.message ).toBeDefined();
                    expect( result.minlength.message ).toEqual( Messages.minLength );
                });

                it( 'that uses message from argument in error metadata', () => {
                    let func = ValidationMethods.minLength( 3, 'custom minLength message' );
                    let result = func( formControl );
                    expect( result[ 'minlength' ].message ).toEqual( 'custom minLength message' );
                });

            });
        });
    });

    describe( 'maxLength:', () => {

        it( 'returns a validation function', () => {
            expect( ValidationMethods.maxLength( 0 ) ).toEqual( jasmine.any( Function ) );
        });

        describe( 'validation method', () => {
            let fn: any;

            beforeEach( () => {
                fn = ValidationMethods.maxLength( 5 );
                spyOn( Validators, 'maxLength' ).and.callThrough();
            });

            it( 'calls the official Angular 2 Validator.maxLength', () => {
                fn( formControl );
                expect( Validators.maxLength ).toHaveBeenCalled();
            });

            describe( 'returns null', () => {
                it( 'when FormControl value is null', () => {
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is undefined', () => {
                    let undefinedValue: any;
                    formControl.setValue( undefinedValue );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is empty string', () => {
                    formControl.setValue( '' );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl has string with length <= max length argument', () => {
                    formControl.setValue( '12345' );
                    expect( fn( formControl ) ).toBeNull();

                    formControl.setValue( '1234' );
                    expect( fn( formControl ) ).toBeNull();
                });
            });

            describe( 'returns error metadata object', () => {

                beforeEach( () => {
                    formControl.setValue( '123456' );
                });

                it( 'when FormControl has string with length > min length argument', () => {
                    let result = fn( formControl );
                    expect( result ).not.toBeNull();
                    expect( result.maxlength ).toBeDefined();
                });

                it( 'with expected metadata properties', () => {
                    let result = fn( formControl );
                    expect( result.maxlength.requiredLength ).toEqual( 5 );
                    expect( result.maxlength.actualLength ).toEqual( 6 );
                });

                it( 'that uses default maxLength message when no message argument is provided', () => {
                    let result = fn( formControl );
                    expect( result.maxlength.message ).toBeDefined();
                    expect( result.maxlength.message ).toEqual( Messages.maxLength );
                });

                it( 'that uses message from argument in error metadata', () => {
                    let func = ValidationMethods.maxLength( 5, 'custom maxLength message' );
                    let result = func( formControl );
                    expect( result[ 'maxlength' ].message ).toEqual( 'custom maxLength message' );
                });

            });
        });
    });

    describe( 'pattern:', () => {

        it( 'returns a validation function', () => {
            expect( ValidationMethods.pattern( '[0-9]*' ) ).toEqual( jasmine.any( Function ) );
        });

        describe( 'validation method', () => {
            let fn: any;

            beforeEach( () => {
                fn = ValidationMethods.pattern( '[0-9]*' );
                spyOn( Validators, 'pattern' ).and.callThrough();
            });

            it( 'calls the official Angular 2 Validator.pattern', () => {
                fn( formControl );
                expect( Validators.pattern ).toHaveBeenCalled();
            });

            describe( 'returns null', () => {
                it( 'when FormControl value is null', () => {
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is undefined', () => {
                    let undefinedValue: any;
                    formControl.setValue( undefinedValue );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is empty string', () => {
                    formControl.setValue( '' );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl has string that matches the pattern argument', () => {
                    formControl.setValue( '0' );
                    expect( fn( formControl ) ).toBeNull();

                    formControl.setValue( '99' );
                    expect( fn( formControl ) ).toBeNull();
                });
            });

            describe( 'returns error metadata object', () => {

                beforeEach( () => {
                    formControl.setValue( 'abc' );
                });

                it( 'when FormControl has value that does not match the pattern argument', () => {
                    let result = fn( formControl );
                    expect( result ).not.toBeNull();
                    expect( result.pattern ).toBeDefined();
                });

                it( 'with expected metadata properties', () => {
                    let result = fn( formControl );
                    expect( result.pattern.requiredPattern ).toEqual( '^[0-9]*$' );
                    expect( result.pattern.actualValue ).toEqual( 'abc');
                });

                it( 'that uses default pattern message when no pattern argument is provided', () => {
                    let result = fn( formControl );
                    expect( result.pattern.message ).toBeDefined();
                    expect( result.pattern.message ).toEqual( Messages.pattern );
                });

                it( 'that uses message from argument in error metadata', () => {
                    let func = ValidationMethods.pattern( '[0-9]*', 'custom pattern message' );
                    let result = func( formControl );
                    expect( result[ 'pattern' ].message ).toEqual( 'custom pattern message' );
                });

                /*
                 The official Angular 2 Validator pattern composes the final RegularExpression via
                 string concatenation, so null and undefined pattern arguments are converted to string equivalents.
                 */
                it( 'when the pattern argument is null', () => {
                    let func = ValidationMethods.pattern( null );
                    formControl.setValue( 'abc' );
                    let result = func( formControl );
                    expect( result ).not.toBeNull();
                    expect( result[ 'pattern' ].requiredPattern ).toEqual( '^null$' );
                });

                it( 'when the pattern argument is undefined', () => {
                    let undefinedPattern: any;
                    let func = ValidationMethods.pattern( undefinedPattern );
                    formControl.setValue( 'abc' );
                    let result = func( formControl );
                    expect( result ).not.toBeNull();
                    expect( result[ 'pattern' ].requiredPattern ).toEqual( '^undefined$' );
                });

            });
        });
    });

    describe( 'withinLength:', () => {

        it( 'returns a validation function', () => {
            expect( ValidationMethods.withinLength( 1, 6 ) ).toEqual( jasmine.any( Function ) );
        });

        describe( 'validation method', () => {
            let fn: any;

            beforeEach( () => {
                fn = ValidationMethods.withinLength( 3, 7  );
            });

            describe( 'returns null', () => {
                it( 'when FormControl value is null', () => {
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is undefined', () => {
                    let undefinedValue: any;
                    formControl.setValue( undefinedValue );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is empty string', () => {
                    formControl.setValue( '' );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl value is a number', () => {
                    formControl.setValue( 3 );
                    let result = fn( formControl );
                    expect( result ).toBeNull();
                });

                it( 'when FormControl has string with length >= min length and <= max length argument', () => {
                    formControl.setValue( '123' );
                    expect( fn( formControl ) ).toBeNull();

                    formControl.setValue( '12345' );
                    expect( fn( formControl ) ).toBeNull();

                    formControl.setValue( '1234567' );
                    expect( fn( formControl ) ).toBeNull();
                });
            });

            describe( 'returns error metadata object', () => {

                beforeEach( () => {
                    formControl.setValue( '12' );
                });

                it( 'when FormControl has string with length < min length argument', () => {
                    let result = fn( formControl );
                    expect( result ).not.toBeNull();
                    expect( result.withinlength ).toBeDefined();
                });

                it( 'when FormControl has string with length > max length argument', () => {
                    formControl.setValue( '12345678' );
                    let result = fn( formControl );
                    expect( result ).not.toBeNull();
                    expect( result.withinlength ).toBeDefined();
                });

                it( 'with expected metadata properties', () => {
                    let result = fn( formControl );
                    expect( result.withinlength.minLength ).toEqual( 3 );
                    expect( result.withinlength.maxLength ).toEqual( 7 );
                    expect( result.withinlength.actualLength ).toEqual( 2 );
                });

                it( 'that uses default withinLength message when no message argument is provided', () => {
                    let result = fn( formControl );
                    expect( result.withinlength.message ).toBeDefined();
                    expect( result.withinlength.message ).toEqual( Messages.withinLength );
                });

                it( 'that uses message from argument in error metadata', () => {
                    let func = ValidationMethods.withinLength( 3, 7 , 'custom withinLength message' );
                    let result = func( formControl );
                    expect( result[ 'withinlength' ].message ).toEqual( 'custom withinLength message' );
                });
            });
        });
    });
});
