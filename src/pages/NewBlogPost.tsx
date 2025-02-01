import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const NewBlogPost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    price: 0,
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('blog_posts')
        .insert([
          {
            ...formData,
            author_id: user?.id
          }
        ]);

      if (submitError) throw submitError;

      navigate('/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showPreview ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{formData.title}</h2>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {formData.content}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content (Markdown supported)
            </label>
            <textarea
              id="content"
              name="content"
              required
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="# Your content here&#10;&#10;Support **bold**, *italic*, and more..."
            />
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              required
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="Investment">Investment</option>
              <option value="Design">Design</option>
              <option value="Market Analysis">Market Analysis</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>
            <div>
              <label htmlFor="sqft" className="block text-sm font-medium text-gray-700 mb-1">
                Square Feet
              </label>
              <input
                type="number"
                id="sqft"
                name="sqft"
                required
                value={formData.sqft}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                required
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                required
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewBlogPost; 