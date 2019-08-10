const { Command, flags } = require("@oclif/command");
const { cli } = require("cli-ux");

const { api } = require("../lib/api");
const { store } = require("../config/config");
const { isConnected } = require("../lib/utils");

class LoginCommand extends Command {
  async signin(email, password) {
    try {
      cli.action.start("Connexion en cours", { stdout: true });
      const response = await api({
        url: "/login",
        method: "POST",
        data: {
          email,
          password
        }
      });
      const { jwtToken } = response.data;
      store.set("token", jwtToken);
      cli.action.stop("Vous êtes connecté");
    } catch (err) {
      cli.action.stop("Une erreur est survenue", err);
    }
  }
  async run() {
    const { flags } = this.parse(LoginCommand);
    if (isConnected) {
      this.warn("Vous êtes connecté");
    } else if (flags.email && flags.password) {
      await this.signin(flags.email, flags.password);
    } else {
      const email = await cli.prompt("Quel est votre e-mail de connexion ?");
      const password = await cli.prompt("Quel est votre mot de passe ?", {
        type: "hide"
      });
      await this.signin(email, password);
    }
  }
}

LoginCommand.description = `Gestion de la connexion de l'utilisateur`;

LoginCommand.flags = {
  email: flags.string({
    char: "e",
    description: "user email",
    multiple: false
  }),
  password: flags.string({
    char: "p",
    description: "user password",
    multiple: false,
    dependsOn: ["email"]
  })
};

module.exports = LoginCommand;
