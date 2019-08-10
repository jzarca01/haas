const { Command, flags } = require("@oclif/command");
const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const { isConnected } = require("../lib/utils");
const { findPlace } = require("../lib/maps");

class PlaceCommand extends Command {
  async run() {
    if (!isConnected) {
      this.error("Vous n'êtes pas connecté.");
    }
    const { args } = this.parse(PlaceCommand);
    if (args.add) {
      let gmapsResults;
      let responses = await inquirer.prompt([
        {
          name: "address",
          message: "Veuillez entrer une adresse de livraison",
          type: "autocomplete",
          source: (answersSoFar, inputText) =>
            findPlace(inputText).then(places => {
              gmapsResults = places;
              return places.map(place => place.formatted_address);
            }),
          validate: val => (val ? true : "Type something !")
        }
      ]);
      const response = gmapsResults.find(
        result => result.formatted_address == responses.address
      );
      console.log(response);
      // to be implemented : post to DB
    } else if (flags.list) {
      // to be implemented : get from DB
    } else {
      this.log("Nothing to see here");
    }
  }
}

PlaceCommand.description = `Gestion des adresses liées à un compte HaaS`;

PlaceCommand.args = [
  { name: "add", description: "Ajouter une adresse" },
  { name: "list", description: "Lister les adresses enregistrées" }
];

module.exports = PlaceCommand;
