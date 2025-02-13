const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Grief Support</h3>
            <p className="text-gray-600">
              Supporting you through your journey of healing and recovery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-600 hover:text-blue-600">About Us</a></li>
              <li><a href="/resources" className="text-gray-600 hover:text-blue-600">Resources</a></li>
              <li><a href="/community" className="text-gray-600 hover:text-blue-600">Community</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-blue-600">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-2">Email: support@griefsupport.com</p>
            <p className="text-gray-600">Phone: (555) 123-4567</p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Grief Support. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
