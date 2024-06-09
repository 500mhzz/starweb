<script lang="ts">
	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />
		<div class="flex flex-col items-center justify-center">
			<slot />
		</div>
		<!-- svelte-ignore a11y-autofocus -->
		<div class="flex flex-row w-full">
			<button
				class="bg-neutral-900/35 border border-white/10 px-5 py-2 rounded-lg w-full"
				autofocus
				on:click={() => dialog.close()}>close modal</button
			>
		</div>
	</div>
</dialog>

<style>
	dialog {
		background-color: rgba(26, 32, 44, 0.35); /* bg-neutral-900/35 */
		backdrop-filter: blur(20px); /* backdrop-blur-lg */
		border: 1px solid rgba(255, 255, 255, 0.1); /* border border-white/10 */
		padding: 1.25rem; /* p-5 */
		max-width: 90%; /* Example max width */
		max-height: 90vh; /* Example max height */
		word-wrap: break-word; /* Ensures text wraps within the dialog */
		overflow-y: auto; /* Adds scroll for content exceeding the max height */
        border-radius: 0.5rem; /* rounded-lg */
        color: white; /* text-white */
	}
</style>
