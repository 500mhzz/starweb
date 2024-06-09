<script lang="ts">
	export let data: {
		image: string;
		exif: string;
	};

	// Function to process the EXIF data
	const processExif = (exifString: string) => {
		const lines = exifString.split('\n').map((line) => line.trim()); // Trim each line
		const processedLines: any = [];
		let isNegativeSection = false;

		lines.forEach((line, index) => {
			if (index === 0) {
				processedLines.push(['Positive: ' + line]);
			} else if (line.startsWith('Negative prompt:')) {
				isNegativeSection = true;
				processedLines.push([line.substring('Negative prompt: '.length)]);
			} else if (isNegativeSection) {
				processedLines.push(line.split(',').map((item) => item.trim()));
			} else {
				const items = line
					.split(' ')
					.filter((item) => item.trim() !== '')
					.map((item) => item.trim());
				if (items.length > 0) {
					processedLines.push(items);
				} else {
					processedLines.push(['']);
				}
			}
		});

		return processedLines;
	};

	let processedExif: any;
	if (data.exif) {
		processedExif = processExif(data.exif);
	}
</script>

<div class="mx-4 sm:mx-12 md:mx-48 lg:mx-96 mt-5">
	<nav
    class="flex flex-col sm:flex-row justify-between items-center bg-neutral-900/35 border border-white/10 rounded-lg px-5 py-3 gap-3 sm:gap-0"
>
    <a
        href="/"
        class="bg-neutral-900/55 hover:bg-neutral-900/90 border border-white/10 rounded-lg px-5 py-2 text-center w-full sm:w-auto"
        >Back home</a
    >
    <p class="text-center sm:text-left">
        <span class="text-yellow-400">StarBoard Web</span> by
        <a class="text-blue-400 hover:underline" href="https://500mhz.xyz">500mhz</a>!
    </p>
</nav>

	<main class="mb-5">
		<img src={data.image} alt="post img" class="w-full rounded-lg mt-5" />
		{#if data.exif}
			<div class="flex flex-col gap-3 mt-5">
				{#each processedExif as items}
					{#each items as item}
						<div class="bg-neutral-900/35 border border-white/10 rounded-lg px-5 py-2">
							<p>{item}</p>
						</div>
					{/each}
				{/each}
			</div>
		{:else}
			<p class="text-red-500 mt-5">No EXIF data found!</p>
		{/if}
	</main>
</div>
