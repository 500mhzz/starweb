import ExifReader from 'exifreader';

async function fetchEXIF(imageUrl: string) {
	try {
		const response = await fetch(imageUrl);
		if (!response.ok) throw new Error('Network response was not ok.');

		const arrayBuffer = await response.arrayBuffer();

		const tags = await ExifReader.load(arrayBuffer);

		return tags;
	} catch (error) {
		console.error('Error fetching or parsing image:', error);
	}
}

export { fetchEXIF };
