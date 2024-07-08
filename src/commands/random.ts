import { ICommand } from "../Interfaces/ICommand";

const command: ICommand = {
  name: "random",
  description: "Generate a random Winner from a list of options",
  aliases: ["r"],
  run: async (_, message, args) => {
    let random = Math.floor(Math.random() * args.length);
    if (args.length === 0)
      return message.reply("Debes ingresar al menos una opción").then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000);
      });

    message.reply({
      embeds: [
        {
          title: "Ganador",
          description: args[random],
          color: 10181046,
        },
      ],
    });
  },
};

export default command;
