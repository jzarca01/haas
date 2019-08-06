const { Command, flags } = require("@oclif/command");
const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const { findPlace } = require("../lib/maps");

class PlaceCommand extends Command {
  async run() {
    const { flags } = this.parse(PlaceCommand);
    let responses = await inquirer.prompt([
      {
        name: "address",
        message: "Veuillez entrer une adresse de livraison",
        type: "autocomplete",
        source: (answersSoFar, inputText) =>
          findPlace(inputText).then(places => places.map(place => place.formatted_address)),
        validate: val => val ? true : 'Type something !'
      }
    ]);
    console.log(responses)
  }
}

PlaceCommand.description = `Search for a place with google maps

...
Extra documentation goes here

`;

PlaceCommand.flags = {
  name: flags.string({ char: "n", description: "name to print" })
};

module.exports = PlaceCommand;
