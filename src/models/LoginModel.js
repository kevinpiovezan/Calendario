const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valid();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('Usuário não existe');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
    }
  }

  async register() {
    this.valid();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push('Usuário já existe.');
  }

  async editPassword() {
    this.valid();
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    this.user = await LoginModel.findOneAndUpdate(
      { email: this.body.email },
      {
        password: this.body.password,
      },
      { returnOriginal: false },
    );
  }

  valid() {
    this.cleanUp();
    const passwordRegExp =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%ˆ&*()_+}|{?><]).{8,}$/g;
    if (!validator.isEmail(this.body.email))
      this.errors.push('E-mail inválido');
    if (this.body.password.length < 8 || this.body.password.length > 32) {
      this.errors.push('A senha precisa ter entre 8 e 32 caracteres');
    }
    if (!this.body.password.match(passwordRegExp)) {
      this.errors.push(
        'A senha precisa ter entre 8 e 32 caracteres, incluindo letras maiúsculas, minusculás, números e simbolos!',
      );
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
