<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<h1>Login</h1>
<form method="post" action="?/signInSocial" use:enhance>
	<input type="hidden" name="provider" value="google" />
	<input type="hidden" name="callbackURL" value="/login" />
	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Sign in with Google</button
	>
</form>
