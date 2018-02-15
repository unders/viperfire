import { wire } from "../../dom/dom";
import { Auth } from "../presenter/auth_presenter";
import { Presenter } from "../presenter/base_presenter";
import { css } from "../css";
import { onClick } from "../actions";

export class AuthView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;
    private readonly signUpOptions: SignUpOptions;
    private readonly signUpWithEmail: SignUpWithEmail;
    private readonly signInWithEmail: SignInWithEmail;
    private readonly signInOptions: SignInOptions;

    constructor() {
        this.html = wire(this);
        this.signUpOptions = new SignUpOptions();
        this.signUpWithEmail = new SignUpWithEmail();
        this.signInWithEmail = new SignInWithEmail();
        this.signInOptions = new SignInOptions();
    }

    render(p: Presenter): string {
        let overlay = `auth-overlay`;
        let container = `auth-container`;
        if (p.auth === Auth.hide) {
            overlay  = `${overlay} ${css.hide}`;
            container  = `${container} ${css.hide}`;
        }

        return this.html`
            <div class="${overlay}"></div>
            <div class="${container}">
                <div class="auth-modal">
                    <div class="auth-modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            fill="#000000" 
                            data-action="${onClick.closeAuth}"
                            height="24" 
                            viewBox="0 0 24 24" 
                            width="24">
                            <path
                                  data-action="${onClick.closeAuth}"
                                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </div>
                    ${this.signUpOptions.render(Auth.signUpOptions === p.auth)}
                    ${this.signUpWithEmail.render(Auth.signUpWithEmail === p.auth)}
                    ${this.signInOptions.render(Auth.signInOptions === p.auth)}
                    ${this.signInWithEmail.render(Auth.signInWithEmail === p.auth)}
                </div>
            </div>
        `;
    }
}

class SignUpOptions {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(show: boolean): string {
        let klass = css.hide;

        if (show) {
            klass = "auth-content";
        }

        return this.html`
            <div class="${klass}">
                <h2>Join Viperfire</h2>
                <button data-action="${onClick.signInWithGoogle}">
                    Sign up with Google
                </button>
                <button data-action="${onClick.signInWithFacebook}">
                    Sign up with Facebook
                </button>
                <button data-action="${onClick.signInWithTwitter}">
                    Sign up with Twitter
                </button>
                <button data-action="${onClick.signUpWithEmail}">
                    Sign up with Email
                </button>
                <p>
                    Already have an account? 
                    <a href="#" data-action="${onClick.signInOptions}">Sign in</a>.
                </p>
                 <a href="/terms-of-service" class="auth-tos">Terms of Service</a>
            </div>
        `;
    }
}

class SignUpWithEmail {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(show: boolean): string {
        let klass = css.hide;

        if (show) {
            klass = "auth-content";
        }

        return this.html`
            <div class="${klass}">
                <h2>Sign up with email</h2>
                <div>Add form ...
                    <button>Create Account</button>
                </div>
                <a href="#" data-action="${onClick.signUpOptions}">All sign up options</a>
                <p> By creating an account, you accept Viperfire's 
                    <a href="/terms-of-service">Terms of Service</a>.
                </p>
            </div>
        `;
    }
}

class SignInOptions {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(show: boolean): string {
        let klass = css.hide;

        if (show) {
            klass = "auth-content";
        }

        return this.html`
            <div class="${klass}">
                <h2>Welcome back.</h2>
                <button
                    data-action="${onClick.signInWithGoogle}">
                    Sign in with Google
                </button>
                <button data-action="${onClick.signInWithFacebook}">
                    Sign in with Facebook
                </button>
                <button data-action="${onClick.signInWithTwitter}">
                    Sign in with Twitter
                </button>
                <button data-action="${onClick.signInWithEmail}">
                    Sign in with email
                </button>
                <p>
                    No account?
                    <a href="#" data-action="${onClick.signUpOptions}">Create one</a>.
                </p>
                <a href="/terms-of-service" class="auth-tos">Terms of Service</a>
            </div>
        `;
    }
}

class SignInWithEmail{
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(show: boolean): string {
        let klass = css.hide;

        if (show) {
            klass = "auth-content";
        }

        return this.html`
            <div class="${klass}">
                <h2>Sign in with email</h2>
                <form action="#" data-action="signInForm" class="sign-in-form" novalidate>
                    <div class="form-field">
                        <input 
                            data-action="signInInput" 
                            required
                            maxlength="150"
                            minlength="4"
                            placeholder="Email"
                            name="email" 
                            type="email"/>
                        <span class="error invisible">visibility:hidden</span>
                    </div>
                    <div class="form-field">
                        <input 
                            data-action="signInInput" 
                            placeholder="Password"
                            required 
                            maxlength="40"
                            minlength="4"
                            type="password"/>
                        <span class="error invisible">visibility:hidden</span>
                    </div>
                    
                    <button>Sign in</button>
                </form>
                <p>
                    <a href="#" data-action="${onClick.signInOptions}">
                       Back to sign in options
                    </a>
                </p>
                <a href="/terms-of-service" class="auth-tos">Terms of Service</a>
            </div>
        `;
    }
}
