import React from 'react';

const Features = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-[#004CAF] mb-12">
        Proč Mage hosting?
      </h2>
      
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="flex flex-col items-center">
          <h4 className="font-bold text-black text-lg mb-2">Stabilní virtualizace</h4>
          <p className="text-gray-700 text-sm max-w-md">Běžíme na prověřeném prostředí, které zaručuje izolaci a výkon.</p>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="font-bold text-black text-lg mb-2">Vlastní ovládací panel</h4>
          <p className="text-gray-700 text-sm max-w-md">Zapomeňte na složité příkazy. V naší aplikaci si vytvoříte účet a spravujete své služby na pár kliknutí.</p>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="font-bold text-black text-lg mb-2">Lidská podpora</h4>
          <p className="text-gray-700 text-sm max-w-md">Nejsme jen stroje, za každým rackem stojí mág připravený pomoci.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Features;