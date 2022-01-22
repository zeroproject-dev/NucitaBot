import { Event } from '../structures/Event';
import { Tts, TTSProviders } from '../utils/tts';

export default new Event('messageCreate', async (interaction) => {
	if (interaction.author.bot) return;

	const firstLetter = interaction.content.charAt(0);
	const tts: Tts =
		firstLetter === process.env.VOICE_FEMALE_PREFIX ||
		firstLetter === process.env.VOICE_MALE_PREFIX
			? new Tts(interaction)
			: null;

	switch (firstLetter) {
		case process.env.COMMAND_PREFIX:
			break;
		case process.env.VOICE_FEMALE_PREFIX:
			tts.speak(TTSProviders.gtts, { lang: 'es' });
			break;
		case process.env.VOICE_MALE_PREFIX:
			tts.speak(TTSProviders.azure, {
				lang: 'es-BO',
				voice: 'es-BO-MarceloNeural',
			});
			break;
		default:
			return;
	}
});
