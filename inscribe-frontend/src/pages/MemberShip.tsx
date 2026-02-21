export default function Membership() {
    return (
        <div className="max-w-6xl mx-auto py-20 grid md:grid-cols-3 gap-10">

            {/* Left Title */}
            <div>
                <h1 className="text-6xl font-serif leading-tight">
                    Membership
                    <br />
                    plans
                </h1>
            </div>

            {/* Plan 1 */}
            <div className="border p-8 rounded-xl space-y-6">
                <h2 className="text-2xl font-semibold">Medium Member</h2>
                <p>$5/month or $50/year</p>
                <button className="w-full bg-green-600 text-white py-2 rounded-full">
                    Get started
                </button>
                <ul className="space-y-2 text-gray-600">
                    <li>✓ Read member-only stories</li>
                    <li>✓ Support writers</li>
                    <li>✓ Offline access</li>
                </ul>
            </div>

            {/* Plan 2 */}
            <div className="border p-8 rounded-xl space-y-6">
                <h2 className="text-2xl font-semibold">Friend of Medium</h2>
                <p>$15/month or $150/year</p>
                <button className="w-full bg-green-600 text-white py-2 rounded-full">
                    Get started
                </button>
                <ul className="space-y-2 text-gray-600">
                    <li>✓ All member benefits</li>
                    <li>✓ Give 4x more to writers</li>
                    <li>✓ Customize experience</li>
                </ul>
            </div>

        </div>
    )
}
