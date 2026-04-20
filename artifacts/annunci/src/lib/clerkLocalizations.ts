import { itIT, enUS, esES } from "@clerk/localizations";

const passwordComplexityIT = {
  sentencePrefix: "La password deve contenere",
  minimumLength: "almeno {{length}} caratteri",
  maximumLength: "meno di {{length}} caratteri",
  requireLowercase: "una lettera minuscola",
  requireUppercase: "una lettera maiuscola",
  requireNumbers: "un numero",
  requireSpecialCharacter: "un carattere speciale",
};

const passwordComplexityES = {
  sentencePrefix: "La contraseña debe contener",
  minimumLength: "al menos {{length}} caracteres",
  maximumLength: "menos de {{length}} caracteres",
  requireLowercase: "una letra minúscula",
  requireUppercase: "una letra mayúscula",
  requireNumbers: "un número",
  requireSpecialCharacter: "un carácter especial",
};

const zxcvbnIT = {
  couldBeStronger: "La password funziona, ma potrebbe essere più sicura. Prova ad aggiungere più caratteri.",
  goodPassword: "La tua password soddisfa tutti i requisiti.",
  notEnough: "La tua password non è abbastanza sicura.",
  suggestions: {
    allUppercase: "Metti in maiuscolo alcune lettere, non tutte.",
    anotherWord: "Aggiungi più parole meno comuni.",
    associatedYears: "Evita anni associati a te.",
    capitalization: "Metti in maiuscolo più della prima lettera.",
    dates: "Evita date e anni associati a te.",
    l33t: "Evita sostituzioni prevedibili come '@' per 'a'.",
    longerKeyboardPattern: "Usa sequenze più lunghe e cambia direzione di digitazione.",
    noNeed: "Puoi creare password sicure senza simboli, numeri o maiuscole.",
    pwned: "Se usi questa password altrove, dovresti cambiarla.",
    recentYears: "Evita anni recenti.",
    repeated: "Evita parole e caratteri ripetuti.",
    reverseWords: "Evita parole comuni al contrario.",
    sequences: "Evita sequenze di caratteri comuni.",
    useWords: "Usa più parole, ma evita frasi comuni.",
  },
  warnings: {
    common: "Questa è una password molto usata.",
    commonNames: "Nomi e cognomi comuni sono facili da indovinare.",
    dates: "Le date sono facili da indovinare.",
    extendedRepeat: "Pattern ripetuti come \"abcabcabc\" sono facili da indovinare.",
    keyPattern: "Sequenze brevi di tasti sono facili da indovinare.",
    namesByThemselves: "Nomi o cognomi singoli sono facili da indovinare.",
    pwned: "La tua password è stata esposta in un data breach.",
    recentYears: "Gli anni recenti sono facili da indovinare.",
    sequences: "Sequenze comuni come \"abc\" sono facili da indovinare.",
    similarToCommon: "È simile a una password comunemente usata.",
    simpleRepeat: "Caratteri ripetuti come \"aaa\" sono facili da indovinare.",
    straightRow: "Righe consecutive di tasti sono facili da indovinare.",
    topHundred: "Questa è una password usata di frequente.",
    topTen: "Questa è una delle password più usate.",
    userInputs: "Non usare dati personali o relativi alla pagina.",
    wordByItself: "Le parole singole sono facili da indovinare.",
  },
};

const zxcvbnES = {
  couldBeStronger: "La contraseña funciona, pero podría ser más segura. Prueba añadiendo más caracteres.",
  goodPassword: "Tu contraseña cumple todos los requisitos.",
  notEnough: "Tu contraseña no es lo suficientemente segura.",
  suggestions: {
    allUppercase: "Escribe en mayúsculas algunas letras, pero no todas.",
    anotherWord: "Añade más palabras menos comunes.",
    associatedYears: "Evita años asociados a ti.",
    capitalization: "Escribe en mayúsculas más que la primera letra.",
    dates: "Evita fechas y años asociados a ti.",
    l33t: "Evita sustituciones predecibles como '@' por 'a'.",
    longerKeyboardPattern: "Usa patrones más largos y cambia la dirección de escritura varias veces.",
    noNeed: "Puedes crear contraseñas seguras sin símbolos, números ni mayúsculas.",
    pwned: "Si usas esta contraseña en otro lugar, deberías cambiarla.",
    recentYears: "Evita años recientes.",
    repeated: "Evita palabras y caracteres repetidos.",
    reverseWords: "Evita palabras comunes al revés.",
    sequences: "Evita secuencias de caracteres comunes.",
    useWords: "Usa múltiples palabras, pero evita frases comunes.",
  },
  warnings: {
    common: "Esta es una contraseña muy utilizada.",
    commonNames: "Los nombres y apellidos comunes son fáciles de adivinar.",
    dates: "Las fechas son fáciles de adivinar.",
    extendedRepeat: "Los patrones repetidos como \"abcabcabc\" son fáciles de adivinar.",
    keyPattern: "Los patrones cortos de teclado son fáciles de adivinar.",
    namesByThemselves: "Los nombres o apellidos solos son fáciles de adivinar.",
    pwned: "Tu contraseña fue expuesta en una filtración de datos.",
    recentYears: "Los años recientes son fáciles de adivinar.",
    sequences: "Las secuencias comunes como \"abc\" son fáciles de adivinar.",
    similarToCommon: "Es similar a una contraseña comúnmente utilizada.",
    simpleRepeat: "Los caracteres repetidos como \"aaa\" son fáciles de adivinar.",
    straightRow: "Las filas de teclas consecutivas son fáciles de adivinar.",
    topHundred: "Esta es una contraseña usada frecuentemente.",
    topTen: "Esta es una de las contraseñas más usadas.",
    userInputs: "No debe haber datos personales o relacionados con la página.",
    wordByItself: "Las palabras solas son fáciles de adivinar.",
  },
};

export const itITCustom = {
  ...itIT,
  formFieldInputPlaceholder__signUpPassword: "Crea una password",
  unstable__errors: {
    ...itIT.unstable__errors,
    form_new_password_matches_current: "La nuova password non può essere uguale a quella corrente.",
    form_password_compromised__sign_in: "Questa password è stata trovata in un data breach. Scegli una password diversa.",
    form_password_untrusted__sign_in: "Questa password non è attendibile. Scegline una diversa.",
    passkey_already_exists: "Una passkey per questo dispositivo esiste già.",
    passkey_not_supported: "Le passkey non sono supportate su questo dispositivo.",
    passkey_pa_not_supported: "Le passkey non sono supportate da questo autenticatore.",
    passkey_registration_cancelled: "Registrazione passkey annullata.",
    passkey_retrieval_cancelled: "Recupero passkey annullato.",
    passwordComplexity: passwordComplexityIT,
    zxcvbn: zxcvbnIT,
  },
  signIn: {
    ...itIT.signIn,
    passwordCompromised: {
      title: "Password compromessa",
    },
    passwordUntrusted: {
      title: "Password non attendibile",
    },
  },
  taskResetPassword: {
    title: "Reimposta la password",
    subtitle: "Il tuo account richiede una nuova password prima di continuare.",
    formButtonPrimary: "Reimposta la password",
    signOut: {
      actionText: "Accesso come {{identifier}}",
      actionLink: "Disconnettiti",
    },
  },
};

export const esESCustom = {
  ...esES,
  formFieldInputPlaceholder__signUpPassword: "Crea una contraseña",
  unstable__errors: {
    ...esES.unstable__errors,
    form_new_password_matches_current: "La nueva contraseña no puede ser igual a la actual.",
    form_password_compromised__sign_in: "Esta contraseña fue encontrada en una filtración de datos. Elige una contraseña diferente.",
    form_password_untrusted__sign_in: "Esta contraseña no es de confianza. Elige una diferente.",
    passkey_already_exists: "Ya existe una passkey para este dispositivo.",
    passkey_not_supported: "Las passkeys no son compatibles con este dispositivo.",
    passkey_pa_not_supported: "Las passkeys no son compatibles con este autenticador.",
    passkey_registration_cancelled: "Registro de passkey cancelado.",
    passkey_retrieval_cancelled: "Recuperación de passkey cancelada.",
    passwordComplexity: passwordComplexityES,
    zxcvbn: zxcvbnES,
  },
  signIn: {
    ...esES.signIn,
    passwordCompromised: {
      title: "Contraseña comprometida",
    },
    passwordUntrusted: {
      title: "Contraseña no confiable",
    },
  },
  taskResetPassword: {
    title: "Restablecer contraseña",
    subtitle: "Tu cuenta requiere una nueva contraseña antes de continuar.",
    formButtonPrimary: "Restablecer contraseña",
    signOut: {
      actionText: "Con sesión iniciada como {{identifier}}",
      actionLink: "Cerrar sesión",
    },
  },
};

export const CLERK_LOCALES = {
  it: itITCustom,
  en: enUS,
  es: esESCustom,
} as const;
