import { Message } from 'discord.js';
import { Tts, TTSProviders } from './../utils/tts';

export class Timer {
	message: Message;
	static timer: NodeJS.Timer = null;
	time: number;
	types = {
		s: (time: number) => {
			this.time = time;
			this.interval();
		},
		m: (time: number) => {
			this.time = time * 60;
			this.interval();
		},
		h: (time: number) => {
			this.time = time * 3600;
			this.interval();
		},
	};

	constructor(message: Message) {
		this.message = message;
	}

	async interval() {
		if (this.time > 28800)
			return this.message
				.reply('El tiempo no puede ser mayor a 8 horas')
				.then((m) => setTimeout(m.delete.bind(m), 5000));

		Timer.timer = setInterval(() => {
			console.log('Time Left: ' + this.time + 's');
			this.time--;
			if (this.time < 0) {
				if (this.message.member.voice?.channelId)
					new Tts(this.message, 'Tiempo Finalizado').speak(TTSProviders.gtts);
				console.log('Time is up');
				return this.stop();
			}
		}, 1000);
	}

	async start(time: string) {
		if (Timer.timer !== null)
			return this.message
				.reply('Ya hay un temporizador activo')
				.then((m) => setTimeout(m.delete.bind(m), 5000));

		let parsedTime = NaN,
			type = '';
		if (time.includes(':')) {
			[parsedTime, type] = this._parseTime(time);
			if (parsedTime > 28800)
				return this.message
					.reply('El tiempo no puede ser mayor a 8 horas')
					.then((m) => setTimeout(m.delete.bind(m), 5000));
		} else {
			type = time.at(-1).toLowerCase();
			if (!Object.keys(this.types).includes(type))
				return this.message
					.reply('Formato de tiempo invalido')
					.then((m) => setTimeout(m.delete.bind(m), 5000));
			parsedTime = parseInt(time.slice(0, -1));
		}

		if (isNaN(parsedTime))
			return this.message
				.reply('Ingrese un número válido')
				.then((m) => setTimeout(m.delete.bind(m), 5000));

		this.message
			.reply(`Temporizador iniciado a ${time}`)
			.then((m) => setTimeout(m.delete.bind(m), 5000));

		this.types[type](parsedTime);
	}

	async stop() {
		if (Timer.timer === null)
			return this.message
				.reply('No hay ningun temporizador activo')
				.then((m) => setTimeout(m.delete.bind(m), 5000));

		clearInterval(Timer.timer);
		Timer.timer = null;
		return this.message.channel
			.send('Temporizador finalizado')
			.then((m) => setTimeout(m.delete.bind(m), 5000));
	}

	private _parseTime(time: string): [number, string] {
		let totalTime: [number, string] = [NaN, ''];

		let arrTime = time.split(':');

		if (arrTime.length === 2) {
			let timeSeconds = parseInt(arrTime[0]) * 3600 + parseInt(arrTime[1]) * 60;
			totalTime = [timeSeconds, 's'];
		}

		return totalTime;
	}
}
