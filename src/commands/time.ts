import { Timer } from "./../structures/Timer";
import { ICommand } from "Interfaces/ICommand";

const time: ICommand = {
  name: "time",
  aliases: ["time", "ti"],
  description: "set the time to notify",
  run: async (_, message, args) => {
    if (args.length < 1)
      return message
        .reply("Debes especificar un tiempo")
        .then((m) => setTimeout(m.delete.bind(m), 5000));

    const timer = new Timer(message);
    if (args[0].toLowerCase() === "stop") {
      timer.stop();
      return;
    }

    timer.start(args[0].trim());
  },
};

export default time;
