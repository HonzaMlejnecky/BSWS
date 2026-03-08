import { useState } from "react"

function PlanCard({ plan, currentPlan, onSelect }) {
    const isActive = currentPlan?.id === plan.id

    return (
        <div
            className={`bg-white rounded-2xl shadow-md p-6 border-2 ${
                isActive ? "border-blue-600" : "border-transparent"
            }`}
        >
            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold mb-4">
                ${plan.price}
                <span className="text-sm text-gray-500"> / month</span>
            </p>

            <ul className="text-sm text-gray-600 space-y-1 mb-6">
                <li>Databases: {plan.maxDatabases}</li>
                <li>SMTP Accounts: {plan.maxSmtp}</li>
                <li>SFTP Accounts: {plan.maxSftp}</li>
            </ul>

            <button
                disabled={isActive}
                onClick={() => onSelect(plan)}
                className={`w-full py-2 rounded-xl ${
                    isActive
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white"
                }`}
            >
                {isActive ? "Current Plan" : "Select Plan"}
            </button>
        </div>
    )
}

export default function SubscriptionPage() {
    const plans = [
        {
            id: 1,
            name: "Free",
            price: 0,
            maxDatabases: 1,
            maxSmtp: 1,
            maxSftp: 1,
        },
        {
            id: 2,
            name: "Pro",
            price: 19,
            maxDatabases: 5,
            maxSmtp: 5,
            maxSftp: 5,
        },
        {
            id: 3,
            name: "Enterprise",
            price: 49,
            maxDatabases: 20,
            maxSmtp: 20,
            maxSftp: 20,
        },
    ]

    const [currentPlan, setCurrentPlan] = useState(plans[0])
    const [validUntil, setValidUntil] = useState(
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    )

    function handleSelectPlan(plan) {
        setCurrentPlan(plan)
        setValidUntil(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Subscription</h1>
                <p className="text-gray-500 mt-2">
                    Manage your current plan and billing.
                </p>
            </div>

            {/* Current Subscription */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
                <h2 className="text-lg font-semibold mb-4">Current Plan</h2>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-xl font-bold">
                            {currentPlan.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            Valid until: {validUntil.toLocaleDateString()}
                        </p>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                        <p>Databases: {currentPlan.maxDatabases}</p>
                        <p>SMTP Accounts: {currentPlan.maxSmtp}</p>
                        <p>SFTP Accounts: {currentPlan.maxSftp}</p>
                    </div>
                </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        currentPlan={currentPlan}
                        onSelect={handleSelectPlan}
                    />
                ))}
            </div>
        </div>
    )
}