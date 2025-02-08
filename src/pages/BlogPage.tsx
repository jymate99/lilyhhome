import { useEffect, useState } from 'react';
import { Calendar, ArrowRight, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  created_at: string;
  author_id: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
};

function BlogPage() {
  const location = useLocation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  // Fetch categories and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const posts = data || [];
        setAllPosts(posts);
        // Initially show only 6 most recent posts
        setPosts(posts.slice(0, 6));

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(posts.map(post => post.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter posts by category
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // If clicking the same category, clear the filter and show 6 most recent posts
      setSelectedCategory(null);
      setPosts(allPosts.slice(0, 6));
    } else {
      setSelectedCategory(category);
      // Show all posts in the selected category
      const filteredPosts = allPosts.filter(post => post.category === category);
      setPosts(filteredPosts);
    }
  };

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after 3 seconds
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Success Message */}
      {message && (
        <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-lg text-center">
          {message}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Real Estate Insights</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay informed with the latest trends, tips, and insights in luxury real estate.
        </p>
        {user && (
          <Link
            to="/blog/new"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create New Post
          </Link>
        )}
      </div>

      {/* Featured Post
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
      </div> */}

      {/* Enhanced Category Filter */}
      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`
                group flex items-center justify-between p-2 rounded-lg border transition-all
                hover:shadow-lg hover:border-blue-500
                ${selectedCategory === category
                  ? 'bg-blue-50 border-blue-500 shadow-sm'
                  : 'bg-gray-50 border-gray-200'
                }
              `}
              aria-label={`Filter by ${category}`}
            >
              <span className={`
                text-lg font-medium
                ${selectedCategory === category
                  ? 'text-blue-700'
                  : 'text-gray-700 group-hover:text-blue-700'
                }
              `}>
                {category}
              </span>
              {selectedCategory === category && (
                <X className="h-5 w-5 text-blue-700" />
              )}
            </button>
          ))}
        </div>
        {selectedCategory ? (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              Showing all <span className="font-bold">{posts.length}</span> posts in
              <span className="font-bold italic"> "{selectedCategory}"</span>
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              Showing <span className="font-bold">6</span> most recent posts.
              Select a category to see more.
            </p>
          </div>
        )}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {posts.map((post) => (
          <Link
            to={`/blog/${post.id}`}
            key={post.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-green-600 font-bold">
                  ${post.price.toLocaleString()}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{post.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Area:</span>
                  <span className="ml-2">{post.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Beds:</span>
                  <span className="ml-2">{post.bedrooms}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Baths:</span>
                  <span className="ml-2">{post.bathrooms}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
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