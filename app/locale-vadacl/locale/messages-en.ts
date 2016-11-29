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
        /*
         The state and zip validation messages will fall back to the locale validation message defaults if no
         domain-level or component-level messages are defined.
         */
    }
};

export { Messages };

