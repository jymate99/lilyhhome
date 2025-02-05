import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { createClient } from '@supabase/supabase-js';
import ReCAPTCHA from "react-google-recaptcha";
import { SEOHead } from '../components/SEOHead';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type FormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  zipCode: string;
  priceRange: string;
  preApproval: string;
  message: string;
};

function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    zipCode: '',
    priceRange: '',
    preApproval: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setRecaptchaError('Please verify you are not a robot');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    setRecaptchaError('');

    try {
      // Send email via EmailJS
      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        city: formData.city,
        zip_code: formData.zipCode,
        price_range: formData.priceRange,
        pre_approval: formData.preApproval,
        message: formData.message,
        'g-recaptcha-response': recaptchaToken,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Save to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          zip_code: formData.zipCode,
          price_range: formData.priceRange,
          pre_approval: formData.preApproval,
          message: formData.message,
        });

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        zipCode: '',
        priceRange: '',
        preApproval: '',
        message: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Lily Living Real Estate",
    "image": "https://your-domain.com/path/to/logo.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Real Estate Ave",
      "addressLocality": "Los Angeles",
      "addressRegion": "CA",
      "postalCode": "90001",
      "addressCountry": "US"
    },
    "telephone": "(555) 123-4567",
    "email": "sarah@luxuryhomes.com"
  };

  return (
    <main>
      <SEOHead 
        title="Contact Lily Living Real Estate | Get in Touch"
        description="Contact Lily Living Real Estate for all your real estate needs. We're here to help you find your dream home."
      />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to find your dream home? I'm here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Required Fields */}
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Optional Fields */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Property Preferences (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="city">
                      Target City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Los Angeles"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="zipCode">
                      Target Zip Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="90001"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2" htmlFor="priceRange">
                    Price Range
                  </label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a price range</option>
                    <option value="0-500000">Under $500,000</option>
                    <option value="500000-1000000">$500,000 - $1,000,000</option>
                    <option value="1000000-2000000">$1,000,000 - $2,000,000</option>
                    <option value="2000000-5000000">$2,000,000 - $5,000,000</option>
                    <option value="5000000+">$5,000,000+</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">
                    Do you have a pre-approval letter?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="preApproval"
                        value="yes"
                        checked={formData.preApproval === "yes"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="preApproval"
                        value="no"
                        checked={formData.preApproval === "no"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="message">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell me about your real estate needs..."
                ></textarea>
              </div>

              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => {
                  setRecaptchaToken(token);
                  setRecaptchaError('');
                }}
                className="mb-4"
              />
              {recaptchaError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  {recaptchaError}
                </div>
              )}

              {/* Add status messages */}
              {submitSuccess && (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                  Message sent successfully! We'll respond within 24 hours.
                </div>
              )}
              {submitError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                aria-label={isSubmitting ? 'Submitting message' : 'Send message'}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">sarah@luxuryhomes.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Office Address</h3>
                    <p className="text-gray-600">
                      123 Real Estate Ave<br />
                      Los Angeles, CA 90001
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-200 h-[300px] rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Map integration would go here</p>
            </div>
          </div>
        </div>
      </div>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </main>
  );
}

export default ContactPage;