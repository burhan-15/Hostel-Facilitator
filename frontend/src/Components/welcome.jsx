import welcomeImage from "../Images/young-friends-hostel.jpg";
import aboutImage from"../Images/young-hostel.jpg";

export default function Welcome() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Hero Section */}
      <div
        className="hero-bg min-h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${welcomeImage})`,
        }}
      >
        <div className="text-center p-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white uppercase tracking-wider drop-shadow-lg">
            Welcome to <br />
            <span className="block mt-2 text-slate-300">Hostel Facilitator</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Your trusted partner in finding the perfect hostel in Islamabad.
          </p>
          <a
            href="/hostels"
            className="inline-block mt-8 px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-lg hover:bg-slate-700 transition-transform transform hover:scale-105"
          >
            Find a Hostel Now
          </a>
        </div>
      </div>

      {/* About Section */}
      <section className="bg-slate-800 py-20 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-4 uppercase">
              About Our Platform
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              We address the lack of reliable information and transparency about hostel
              options in Islamabad for students and job holders relocating to the city.
            </p>
            <p className="text-gray-400">
              Our platform allows hostel seekers to explore a wide range of options, read
              real tenant reviews, and view ratings. We empower you to make informed
              decisions, avoid exploitation, and find a safe and suitable place to live.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={aboutImage}
              alt="Hostel"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>
      <section className="bg-slate-800 py-20 px-6 lg:px-16">
        <div className="bg-gray-900 py-16 md:py-24">
            <div className="container mx-auto px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-white text-center mb-12 uppercase">Meet the Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['Faisal (Product Owner)', 'Huzaifa Ali (Scrum Master)', 'Burhan Ahmed (Scrum Team)'].map((member, index) => (
                        <div key={index} className="text-center p-6 bg-gray-800 rounded-lg shadow-xl transform transition-transform hover:scale-105 border border-gray-700">
                            <img src={`https://placehold.co/150x150/475569/ffffff?text=${member.split(' ')[0]}`} alt={member} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-500 object-cover" />
                            <h3 className="text-2xl font-semibold text-white">{member.split(' (')[0]}</h3>
                            <p className="text-slate-400">{member.split('(')[1].replace(')', '')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
