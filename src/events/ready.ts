import { ExtendedClient } from "structures/Client";
import { IEvent } from "../Interfaces/IEvent";

const event: IEvent = {
  name: "ready",
  run: (client: ExtendedClient, _: any) => {
    client.logger.log(`${client.user.tag} is ready!\n`, { before: "\n" });
  },
};

export default event;
