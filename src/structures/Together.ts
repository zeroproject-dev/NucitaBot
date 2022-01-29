import { ITogether } from './../Interfaces/ITogether';
import { Message } from 'discord.js';
import { ExtendedClient } from './Client';
import { Activities } from '../utils/Activities';
import { IActivity } from './../Interfaces/IActivity';
import fetch from 'node-fetch';

export class Together {
	client: ExtendedClient;
	message: Message;

	constructor(client: ExtendedClient, message: Message) {
		this.client = client;
		this.message = message;
	}

	private async getActivitieLink(code: string): Promise<ITogether> {
		const channel = this.message.member.voice.channelId;
		if (!channel) return { error: 'No estas en un canal de voz' };
		const response = await fetch(
			`https://discord.com/api/v8/channels/${channel}/invites`,
			{
				method: 'POST',
				body: JSON.stringify({
					max_age: 86400,
					max_uses: 0,
					target_application_id: code,
					target_type: 2,
					temporary: false,
					validate: null,
				}),
				headers: {
					Authorization: `Bot ${this.client.token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const invite: ITogether = await response.json();
		return invite;
	}

	async createInvite(name: string) {
		for (let i = 0; i < Activities.length; i++) {
			if (Activities[i].aliases.includes(name)) {
				const invite: ITogether = await this.getActivitieLink(
					Activities[i].code
				);

				if (invite.error) {
					return this.message.reply(invite.error).then((msg) => {
						setTimeout(() => {
							msg.delete();
						}, 1000);
					});
				}

				return await this.message.channel
					.send({
						embeds: [
							{
								title: 'Actividad ' + Activities[i].name,
								description: Activities[i].description,
								url: `https://discord.gg/${invite.code}`,
							},
						],
					})
					.then((msg) => {
						setTimeout(() => {
							msg.delete();
						}, 10000);
					});
			}
		}

		return this.message.reply('No se encontro la actividad').then((msg) => {
			setTimeout(() => {
				msg.delete();
			}, 5000);
		});
	}

	async getList(message: Message) {
		let activities: string = '';
		let aliases: string = '';
		Activities.forEach((activity: IActivity) => {
			activities += activity.name + '\n';
			aliases += activity.aliases.join(', ') + '\n';
		});

		await message
			.reply({
				embeds: [
					{
						title: 'Lista de actividades',
						author: {
							iconURL: this.client.user.avatarURL(),
						},
						color: 10181046,
						fields: [
							{
								name: 'Actividad: ',
								value: activities,
								inline: true,
							},
							{
								name: 'Alias: ',
								value: aliases,
								inline: true,
							},
						],
					},
				],
			})
			.then((msg) => {
				setTimeout(() => {
					msg.delete();
				}, 10000);
			});
	}
}
