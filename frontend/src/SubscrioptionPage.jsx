import useSubscriptions from './hooks/useSubscriptions';

function PlanCard({ plan, currentPlan, onSelect, loading }) {
  const isActive = currentPlan?.id === plan.id;

  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 border-2 ${isActive ? 'border-blue-600' : 'border-transparent'}`}>
      <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
      <p className="text-3xl font-bold mb-4">
        ${plan.priceMonthly}
        <span className="text-sm text-gray-500"> / month</span>
      </p>
      <ul className="text-sm text-gray-600 space-y-1 mb-6">
        <li>Databases: {plan.maxDatabases}</li>
        <li>Email Accounts: {plan.maxEmailAccounts}</li>
        <li>SFTP Accounts: {plan.maxFtpAccounts}</li>
      </ul>
      <button
        disabled={isActive || loading}
        onClick={() => onSelect(plan.id)}
        className={`w-full py-2 rounded-xl ${isActive ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
      >
        {isActive ? 'Current Plan' : loading ? 'Processing...' : 'Select Plan'}
      </button>
    </div>
  );
}

export default function SubscriptionPage() {
  const { plans, currentPlan, currentSubscription, loading, error, selectPlan } = useSubscriptions();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-gray-500 mt-2">Manage your current plan and billing.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xl font-bold">{currentPlan?.name || 'No plan selected'}</p>
            <p className="text-sm text-gray-500">
              Valid until: {currentSubscription?.expiresAt ? new Date(currentSubscription.expiresAt).toLocaleDateString() : '-'}
            </p>
          </div>
          {currentPlan && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>Databases: {currentPlan.maxDatabases}</p>
              <p>Email Accounts: {currentPlan.maxEmailAccounts}</p>
              <p>SFTP Accounts: {currentPlan.maxFtpAccounts}</p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} currentPlan={currentPlan} onSelect={selectPlan} loading={loading} />
        ))}
      </div>
    </div>
  );
}
