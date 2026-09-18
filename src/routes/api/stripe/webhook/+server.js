import Stripe from 'stripe';
import { getDb } from '$lib/server/db.js';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request }) {
	const rawBody = await request.arrayBuffer();

	const event = await stripe.webhooks.constructEvent(
		Buffer.from(rawBody),
		request.headers.get('stripe-signature'),
		STRIPE_WEBHOOK_SECRET
	);

	if (event.type === 'checkout.session.completed') {
		const charge = event.data.object;
		const sessionId = charge.id;
		const customerId = charge.metadata.customerId;
		const address = charge.customer_details.address;

		const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

		const items = lineItems.data.map((item) => ({
			name: item.description || 'Unknown product',
			quantity: item.quantity,
			total: item.amount_total
		}));
		const totalPrice = charge.amount_total;
		console.log('all good');
		try {
			const db = await getDb();

			const orders = db.collection('orders');

			await orders.insertOne({
				customerId: new ObjectId(customerId),
				address,
				items,
				totalPrice,
				createdAt: new Date(),
				delivered: false,
				prepared: false
			});
			console.log('orden creada');

			//revalidatePath("/")
			//return { successMsg: "order created" }
		} catch (e) {
			console.error(e);
			//return { error: "Failed to create order" }
		}
	}
	return json({ message: 'exito' });
}
