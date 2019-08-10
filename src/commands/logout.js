const { Command } = require("@oclif/command");
const { cli } = require("cli-ux");

const { store } = require("../config/config");
const { isConnected } = require("../lib/utils");

class LogoutCommand extends Command {
  async signout() {
    try {
      cli.action.start("Déconnexion en cours", { stdout: true });
      await api({
        url: "/logout",
        method: "POST",
        headers: {
          Authorization: `Bearer ${store.get("token")}`
        }
      });
      store.clear();
      cli.action.stop("Vous êtes déconnecté");
    } catch (err) {
      cli.action.stop("Une erreur est survenue", err);
    }
  }
  async run() {
    if (isConnected) {
      this.signout();
    }
  }
}

LogoutCommand.description = `Gestion de la déconnexion de l'utilisateur`;

module.exports = LogoutCommand;
