import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Investing in Luxury Real Estate",
    excerpt: "Learn the key strategies for making smart investments in high-end properties...",
    date: "March 15, 2024",
    author: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    category: "Investment"
  },
  {
    id: 2,
    title: "The Latest Trends in Modern Home Design",
    excerpt: "Discover the most popular architectural and interior design trends shaping luxury homes...",
    date: "March 10, 2024",
    author: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
    category: "Design"
  },
  {
    id: 3,
    title: "Understanding the Los Angeles Luxury Market",
    excerpt: "An in-depth analysis of current market trends and opportunities in LA's luxury real estate...",
    date: "March 5, 2024",
    author: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800",
    category: "Market Analysis"
  }
];

function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Real Estate Insights</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay informed with the latest trends, tips, and insights in luxury real estate.
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200"
            alt="Featured Post"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="mb-4">
              <span className="bg-blue-600 text-sm px-3 py-1 rounded-full">Featured</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              The Future of Luxury Real Estate: What to Expect in 2024
            </h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                March 20, 2024
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Sarah Johnson
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-blue-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 mb-6">
          Get the latest real estate insights and market updates delivered to your inbox.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            Subscribe
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;