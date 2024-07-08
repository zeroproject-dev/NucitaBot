import { ConsoleColors } from "./console-colors";

export class ConsoleLogger {
  #name?: string;
  #withDate: boolean;

  constructor(name?: string, withDate: boolean = false) {
    this.#name = name;
    this.#withDate = withDate;
  }

  setName(name: string): void {
    this.#name = name;
  }

  setWithDate(withDate: boolean): void {
    this.#withDate = withDate;
  }

  #generateDate(): string {
    return new Date().toLocaleTimeString("es-ES", { hourCycle: "h24" });
  }

  #generateMessage(
    message: string,
    opts: { color: ConsoleColors; before?: string } = {
      color: ConsoleColors.FgWhite,
    },
  ): string {
    return `${opts.before ?? ""}[${opts.color}${this.#name + (this.#withDate ? ` ${ConsoleColors.FgBlack}${this.#generateDate()}` : "")}${ConsoleColors.Reset}] ${message}`;
  }

  log(message: string, opts?: { before: string }): void {
    console.log(
      this.#generateMessage(message, { color: ConsoleColors.FgGray, ...opts }),
    );
  }

  error(message: string, opts?: { before: string }): void {
    console.error(
      this.#generateMessage(message, { color: ConsoleColors.FgRed, ...opts }),
    );
  }

  warn(message: string, opts?: { before: string }): void {
    console.warn(
      this.#generateMessage(message, {
        color: ConsoleColors.FgYellow,
        ...opts,
      }),
    );
  }

  debug(message: string, opts?: { before: string }): void {
    if (process.env.ENVIROMENT !== "debug") return;

    console.debug(
      this.#generateMessage(message, { color: ConsoleColors.FgBlue, ...opts }),
    );
  }
}
