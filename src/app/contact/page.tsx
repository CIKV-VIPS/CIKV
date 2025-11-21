import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';

export default function ContactUs() {
  const location = {
    name: "VIPS-TC, Pitampura",
    address: "Vivekananda Institute of Professional Studies, Outer Ring Rd, AU Block, Pitampura, New Delhi, Delhi 110034",
    lat: 28.7034,
    lng: 77.1530,
  };

  return (
    <main className="bg-[#FFFBEB] min-h-screen">
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-amber-900 font-serif mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          We'd love to hear from you. Reach out with any questions or to get involved with our community.
        </p>
      </section>

      <section className="container mx-auto px-6 pb-20 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-amber-900 font-serif mb-6 text-center">Contact Details</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <HiOutlineMail className="w-7 h-7 text-amber-800 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Email</h3>
                  <a 
                    href="mailto:indianknowledgeandvaluesvips@gmail.com" 
                    className="text-lg text-gray-600 hover:text-amber-700"
                  >
                    indianknowledgeandvaluesvips@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <FaLinkedin className="w-7 h-7 text-amber-800 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">LinkedIn</h3>
                  <a 
                    href="https://www.linkedin.com/company/centre-for-indian-knowledge-and-values/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg text-gray-600 hover:text-amber-700"
                  >
                    CIKV Official Page
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <HiOutlineLocationMarker className="w-7 h-7 text-amber-800 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Our Location</h3>
                  <p className="text-lg text-gray-600">{location.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="rounded-lg shadow-xl overflow-hidden">
          <iframe
            title="CIKV Location"
            src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
            width="100%"
            height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen={true}
            aria-hidden="false"
            tabIndex={0}
          ></iframe>
        </div>
      </section>
    </main>
  );
}
