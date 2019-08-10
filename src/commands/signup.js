const { Command } = require("@oclif/command");
const { cli } = require("cli-ux");

const { api } = require("../lib/api");
const { store } = require("../config/config");

class SignupCommand extends Command {
  async signup(email, password, mobile) {
    try {
      cli.action.start("Inscription en cours", { stdout: true });
      const response = await api({
        url: "/signup",
        method: "POST",
        data: {
          email,
          mobile,
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

  async verifyMobile() {
    try {
      let isMobileValidated = false;
      do {
        const verificationCode = await cli.prompt(
          "Veuillez saisir le code de vérification qui vous a été envoyé par SMS"
        );
        cli.action.start("Vérification en cours", { stdout: true });
        const response = await api({
          url: "/signup",
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.get("token")}`
          },
          data: {
            verificationCode
          }
        });
        const { isValid } = response.data;
        isMobileValidated = isValid;
      } while (!isMobileValidated);
      cli.action.stop("Votre compte a été vérifié");
    } catch (err) {
      cli.action.stop("Une erreur est survenue", err);
    }
  }

  async run() {
    if (isConnected) {
      this.warn("Vous êtes déjà connecté");
    } else {
      const email = await cli.prompt("Quel est votre e-mail ?");
      const password = await cli.prompt("Quel est votre mot de passe ?", {
        type: "hide"
      });
      const mobile = await cli.prompt(
        "Afin de garantir la livraison, nous avons également besoin de votre numéro de portable"
      );
      await this.signup(email, password, mobile);
      await this.verifyMobile();
    }
  }
}

SignupCommand.description = `Gestion de l'inscription de l'utilisateur`;

module.exports = SignupCommand;
