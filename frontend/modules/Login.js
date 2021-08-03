export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }
    init(){
        this.events();
    }
    events(){
        if(!this.form) return;
        this.form.addEventListener('submit', e =>{
            e.preventDefault();
            this.validate(e);
        });
    };
    validate(e) {
        const el = e.target;
    }
};