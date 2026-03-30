import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';

const planCards = [
  {
    name: 'Basic',
    description: '1 projekt, FTP přístup a rychlé publikování statického webu.',
    highlights: ['1 projekt', 'FTP přístup', 'Základní publikace'],
  },
  {
    name: 'Standard',
    description: 'Univerzální balíček pro firemní prezentace s přímým uploadem přes aplikaci.',
    highlights: ['Až 3 projekty', 'FTP + upload přes aplikaci', 'Vyšší kapacita'],
  },
  {
    name: 'Premium',
    description: 'Nejvyšší limity pro náročnější weby a prioritu v provisioning workflow.',
    highlights: ['Až 10 projektů', 'Rozšířené limity', 'Prioritní konfigurace'],
  },
];

export default function LandingPage() {
  return (
    <>
      <Hero onOpenModal={(isLogin) => (window.location.href = isLogin ? '/login' : '/register')} />
      <Services />
      <Features />

      <section className="py-24 bg-[#F5F9FF]">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-3xl font-bold text-[#004CAF] mb-4">Hostingové plány</h2>
          <p className="text-center text-gray-600 mb-12">Vyberte plán podle rozsahu vašich webových projektů.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planCards.map((plan) => (
              <div key={plan.name} className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-[#004CAF]">{plan.name}</h3>
                <p className="text-gray-600 mt-3">{plan.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-gray-700">
                  {plan.highlights.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-3 bg-[#004CAF] text-white rounded-full font-semibold hover:bg-[#003d96]">Začít registrací</Link>
            <Link to="/login" className="px-8 py-3 border border-[#004CAF] text-[#004CAF] rounded-full font-semibold hover:bg-blue-50">Přihlásit se</Link>
          </div>
        </div>
      </section>
    </>
  );
}
