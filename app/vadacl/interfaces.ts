/*
 Interfaces that can be used by the TypeScript compiler to enforce the proper key/value pairs for the validation options.
 */
interface RequiredSettings {
    message ?: string
}

interface RequiredTrueSettings {
    message ?: string
}

interface MinLengthSettings {
    minLength : number,
    message ?: string
}

interface MaxLengthSettings {
    maxLength : number,
    message ?: string
}

interface PatternSettings {
    pattern : string,
    message ?: string
}

interface WithinLengthSettings {
    minLength : number,
    maxLength : number,
    message ?: string
}

interface TotalsSettings {
    total : number,
    message ?: string
}

interface EqualValuesSettings {
    message ?: string
}

interface WithinTrueCountSettings {
    minCount : number,
    maxCount : number,
    message ?: string
}

/*
 Interface for defining any and all known validation methods for a given domain object property
 */
interface PropertyValidations {
    required ?: RequiredSettings,
    requiredTrue ?: RequiredTrueSettings,
    minLength ?: MinLengthSettings,
    maxLength ?: MaxLengthSettings,
    pattern ?: PatternSettings,
    withinLength ?: WithinLengthSettings,
    totals ?: TotalsSettings,
    equalValues ?: EqualValuesSettings,
    withinTrueCount ?: WithinTrueCountSettings
}

/*
 Interface that can be implemented by domain classes to enforce the presence of a "validations" property object literal.
 */
interface Validatable {
    validations: { [ index: string ]: any };
}

export { PropertyValidations, Validatable }

