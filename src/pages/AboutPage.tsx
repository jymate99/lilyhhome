import React from 'react';
import { Award, Users, Home, ThumbsUp } from 'lucide-react';

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Lily Huang</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted real estate professional with over 15 years of experience in the luxury property market.
        </p>
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <img
            src="https://images.unsplash.com/photo-1737202777198-7a913f95aa01?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Lily Huang"
            className="rounded-lg shadow-lg w-full h-[500px] object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">My Story</h2>
          <p className="text-gray-600 mb-6">
            With a passion for real estate and a commitment to excellence, I've helped hundreds of clients find their perfect homes. My approach combines deep market knowledge with personalized service to ensure every client receives the attention they deserve.
          </p>
          <p className="text-gray-600 mb-6">
            I specialize in luxury properties across Los Angeles, with particular expertise in Beverly Hills, Malibu, and Hollywood Hills. My network of connections and intimate knowledge of these areas allows me to find hidden gems and negotiate the best deals for my clients.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-gray-600">Properties Sold</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Top Agent 2023</h3>
          <p className="text-gray-600">Recognized by LA Real Estate Board</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">1000+ Clients</h3>
          <p className="text-gray-600">Satisfied homeowners</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <Home className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">$1B+ Sales</h3>
          <p className="text-gray-600">In property transactions</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <ThumbsUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">15+ Years</h3>
          <p className="text-gray-600">Industry experience</p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-4">
              "Sarah's expertise and dedication made our home buying process smooth and enjoyable. She truly goes above and beyond for her clients."
            </p>
            <p className="font-bold">- Michael & Emma Thompson</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-4">
              "Working with Sarah was the best decision we made. Her knowledge of the luxury market is unmatched."
            </p>
            <p className="font-bold">- David Chen</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;