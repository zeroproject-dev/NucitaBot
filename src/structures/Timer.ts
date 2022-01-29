import { Message } from 'discord.js';
import { Tts, TTSProviders } from './../utils/tts';

export class Timer {
	message: Message;
	timer: NodeJS.Timer = null;
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

		this.timer = setInterval(() => {
			console.log('Time Left: ' + this.time);
			this.time--;
			if (this.time < 0) {
				if (this.message.member.voice?.channelId)
					new Tts(this.message, 'Tiempo Finalizado').speak(TTSProviders.gtts);
				console.log('Time is up');
				return this.stop();
			}
		}, 1000);
	}

	async start(type: string, time: number) {
		if (time > 8 && type === 'h')
			return this.message
				.reply('El tiempo no puede ser mayor a 8 horas')
				.then((m) => setTimeout(m.delete.bind(m), 5000));

		if (this.types[type] === undefined)
			return this.message
				.reply('Tipo Invalido')
				.then((m) => setTimeout(m.delete.bind(m), 5000));

		this.types[type](time);
	}

	async stop() {
		if (this.timer === null)
			return this.message
				.reply('No hay ningun temporizador activo')
				.then((m) => setTimeout(m.delete.bind(m), 5000));

		clearInterval(this.timer);
		this.timer = null;
		return this.time > 0
			? this.message.channel
					.send(`Temporizador detenido`)
					.then((m) => setTimeout(m.delete.bind(m), 5000))
			: this.message.channel
					.send('El tiempo ha finalizado')
					.then((m) => setTimeout(m.delete.bind(m), 5000));
	}
}
