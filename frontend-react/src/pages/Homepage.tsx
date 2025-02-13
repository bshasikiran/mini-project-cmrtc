
const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-5xl font-bold text-blue-900 mb-6">
              Share Your Journey Through Grief
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A safe space to express, connect, and heal. Join our community of support and understanding.
            </p>
            <div className="space-x-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                Get Started
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="/path-to-your-image.svg" 
              alt="Support Illustration" 
              className="w-full max-w-lg mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            How We Support You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-blue-50 hover:shadow-lg transition duration-300">
              <div className="text-blue-600 text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Share Your Story
              </h3>
              <p className="text-gray-600">
                Express your feelings and experiences in a supportive environment.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 hover:shadow-lg transition duration-300">
              <div className="text-blue-600 text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Connect with Others
              </h3>
              <p className="text-gray-600">
                Find people who understand your journey and share similar experiences.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 hover:shadow-lg transition duration-300">
              <div className="text-blue-600 text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Access Resources
              </h3>
              <p className="text-gray-600">
                Discover helpful tools and professional guidance for your healing journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our compassionate community today and take the first step towards healing.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-300">
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
