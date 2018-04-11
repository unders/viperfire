import { Page } from "../page/page";
import { Logger } from "../log/log";
import { SignInForm } from "../shared/presenter/sign_in_form_presenter";

interface Context {
    page: Page;
    logger: Logger;
}

interface ValidityResult {
    data: data;
    valid: boolean;
}

interface data {
    email: string;
    password: string;
}

export class SignInFormHelper {
    private readonly page: Page;
    private readonly logger: Logger;

    constructor(ctx: Context) {
        this.page = ctx.page;
        this.logger = ctx.logger;
    }

    disableSubmit(): void {
        this.page.presenter.signInForm.disableSubmit = true;
        this.page.render();
    }

    enableSubmit(): void {
        this.page.presenter.signInForm.disableSubmit = false;
        this.page.render();
    }

    checkValidity(form: HTMLFormElement): ValidityResult {
        const emailInput = form["email"] as HTMLInputElement;
        const email = emailInput.value.trim();

        const passwordInput = form["password"] as HTMLInputElement;
        const password = passwordInput.value;

        this.page.presenter.signInForm.disableSubmit = false;
        if (form.checkValidity()) {
            form.reset();
            this.page.presenter.signInForm.emailError = false;
            this.page.presenter.signInForm.passwordError = false;

            this.page.render();
            return { data: { email: email, password: password }, valid: true }
        }

        this.page.presenter.signInForm.emailError = !emailInput.validity.valid;
        this.page.presenter.signInForm.passwordError = !passwordInput.validity.valid;

        this.page.render();
        return { data: { email: email, password: password }, valid: false };
    }
}
