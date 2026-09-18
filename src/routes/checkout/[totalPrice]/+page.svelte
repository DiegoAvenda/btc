<script>
	import { cart } from '$lib/utils/cart.svelte.js';
	import { resolve } from '$app/paths';

	let { data } = $props();

	let toggleCheckout = $state(false);

	async function checkout() {
		if (data.customerId === null) {
			toggleCheckout = true;
			return;
		}

		await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: cart, customerId: data.customerId })
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				window.location.replace(data.url);
			});
	}
</script>

<div class="m-6 flex justify-center">
	<div class="card bg-base-100 shadow-xl">
		<h2 class="card-title justify-center">Select your location</h2>
		<figure class="px-10 pt-10">
			<div class=" h-96 w-96 md:w-160 lg:w-240" id="customerLocation"></div>
		</figure>
		<div class="card-body items-center text-center">
			<div class="card-actions">
				<button onclick={() => checkout()} class="btn btn-primary"
					>Confirm location & go to checkout</button
				>
			</div>
			{#if toggleCheckout}
				<span>Please <a class="link" href={resolve('/login')}>login</a> first</span>
			{/if}
		</div>
	</div>
</div>
