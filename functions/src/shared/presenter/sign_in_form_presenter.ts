export interface SignInForm {
    disableSubmit: boolean;
    email: string;
    emailError: boolean;
    password: string;
    passwordError: boolean;
}

export let signInForm: SignInForm = {
    disableSubmit: false,
    email: "",
    emailError: false,
    password: "",
    passwordError: false
};
