import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY")

export const redirectToCheckout = async () => {
    const stripe = await stripePromise

    if (!stripe) return

    const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/payment/checkout`, {
        method: "POST",
    })

    const session = await response.json()

    await (stripe as any).redirectToCheckout({ sessionId: session.id })
}
