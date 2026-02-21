import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY")

export const redirectToCheckout = async () => {
    const stripe = await stripePromise

    if (!stripe) return

    const response = await fetch("http://localhost:8080/api/payment/checkout", {
        method: "POST",
    })

    const session = await response.json()

    await (stripe as any).redirectToCheckout({ sessionId: session.id })
}
