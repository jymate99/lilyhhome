import React, { useEffect, useState } from 'react';
import { Search, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
};

function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setFeaturedProperties(data || []);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
            alt="Luxury Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-xl text-white mb-8">
            Discover luxury properties in prime locations
          </p>
          <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Price Range"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Search className="mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link 
                to={`/blog/${property.id}`}
                key={property.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-duration-300"
              >
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <p className="text-green-600 text-xl font-semibold mb-2">
                    ${property.price.toLocaleString()}
                  </p>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-gray-600">
                    <div className="text-center">
                      <div className="font-medium">{property.bedrooms}</div>
                      <div className="text-sm">Beds</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{property.bathrooms}</div>
                      <div className="text-sm">Baths</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{property.sqft.toLocaleString()}</div>
                      <div className="text-sm">Sq.ft</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8">Let us help you find the perfect property that matches your lifestyle.</p>
          <Link
            to="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;