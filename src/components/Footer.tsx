import { APP_NAME, APP_VERSION, LAUNCH_DATE } from '../utils/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">{APP_NAME}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Quality Complaint Management System
            </p>
            <p className="text-xs text-gray-500">
              Version {APP_VERSION} | Launched {LAUNCH_DATE}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#dashboard" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#issues" className="hover:text-blue-600 transition-colors">
                  Issues
                </a>
              </li>
              <li>
                <a href="#documentation" className="hover:text-blue-600 transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Support</h3>
            <p className="text-sm text-gray-600 mb-2">
              For assistance, contact the UB Cares support team
            </p>
            <p className="text-xs text-gray-500">
              View Documentation page for contact details
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} United Breweries Limited. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Built with ❤️ for quality excellence
          </p>
        </div>
      </div>
    </footer>
  );
}

