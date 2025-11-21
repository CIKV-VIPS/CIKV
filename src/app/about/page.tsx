import Image from 'next/image';

const ObjectiveCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-[#FFFBEB] text-gray-800 p-6 rounded-lg shadow-lg text-center transition-transform hover:scale-105">
      <h3 className="text-2xl font-semibold text-amber-900 mb-3 font-serif">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default function AboutPage() {
  return (
    <main className="bg-[#FFFBEB]">
      <section 
        className="relative bg-cover bg-center h-[30vh]" 
        style={{ backgroundImage: `url(/assets/cikv_banner2.png)` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container relative z-10 mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white font-serif shadow-sm">
            About CIKV
          </h1>
          <p className="text-2xl text-white mt-2 shadow-sm">
            Bridging Ancient Wisdom with the Modern World
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 text-gray-700 leading-relaxed">
            <h2 className="text-4xl font-bold text-amber-900 mb-6 font-serif">
              A Movement to Preserve Our Heritage
            </h2>
            <p className="text-lg mb-4">
              Centre for Indian Knowledge and Values (CIKV) embodies the rich tapestry of India's cultural heritage, ethical traditions, and profound wisdom. It is a movement dedicated to exploring and spreading the wealth of India's ethical and cultural legacy.
            </p>
            <p className="text-lg mb-4">
              At its core, CIKV seeks to bridge the ancient with the modern, creating a platform where awareness about our ethics and values becomes a guiding light for individuals and communities alike. India's ancient scriptures, philosophical treatises, and spiritual practices offer a treasure trove of wisdom that remains as relevant today as it was centuries ago.
            </p>
            <p className="text-lg">
              By delving into these teachings, CIKV aspires to nurture a sense of pride in our shared heritage and a commitment to ethical living.
            </p>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-amber-800 mb-3 font-serif">Our Mission</h3>
              <p className="text-lg text-gray-700">
                To serve as a beacon of knowledge, guiding people to rediscover the roots of Indian ethics and values and inspire a deeper appreciation of our roots.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-amber-800 mb-3 font-serif">Our Vision</h3>
              <p className="text-lg text-gray-700">
                To cultivate a global community grounded in mutual respect, integrity, and harmony, where compassion and honesty are practiced virtues.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#6D2828] text-amber-100 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-12 font-serif">
            Our Core Objectives
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ObjectiveCard
              title="Awareness"
              description="Create widespread awareness about timeless principles found in Indian traditions."
            />
            <ObjectiveCard
              title="Education"
              description="Provide structured learning opportunities about Indian ethics, values, and philosophies."
            />
            <ObjectiveCard
              title="Practice"
              description="Encourage individuals to incorporate these values into their daily lives."
            />
            <ObjectiveCard
              title="Integration"
              description="Build a bridge between ancient Indian knowledge and contemporary life."
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-6 font-serif">
            Why CIKV Matters Today
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto text-center mb-12">
            In an era of rapid globalization and ethical dilemmas, CIKV stands as a reminder that solutions to
            modern challenges lie within our own heritage. Indian knowledge systems emphasize:
          </p>
          <ul className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <li className="text-center">
              <div className="text-6xl text-yellow-700 mb-4">🪷</div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-3 font-serif">Balance & Harmony</h3>
              <p className="text-gray-600">Through the concept of Dharma, the guiding principle of duty and righteousness.</p>
            </li>
            <li className="text-center">
              <div className="text-6xl text-yellow-700 mb-4">🧘</div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-3 font-serif">Self-Realization</h3>
              <p className="text-gray-600">Through practices like Yoga and meditation, fostering inner peace and resilience.</p>
            </li>
            <li className="text-center">
              <div className="text-6xl text-yellow-700 mb-4">🌍</div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-3 font-serif">Universal Brotherhood</h3>
              <p className="text-gray-600">Promoted by the idea of Vasudhaiva Kutumbakam—"the world is one family."</p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
