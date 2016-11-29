import { Company } from './company';

/*
 Extends the Company class simply to allow for enterprise-specific validation errors to be defined in the locale
 messages.
*/
export class EnterpriseCompany extends Company {
    constructor() {
        super();
    }
}