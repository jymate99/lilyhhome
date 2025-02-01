import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Edit, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
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

const BlogViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setPost(data);
        setEditedPost(data);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedPost(post || {});
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditedPost({
      ...editedPost,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update(editedPost)
        .eq('id', id);

      if (updateError) throw updateError;

      setPost(editedPost as BlogPost);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update blog post');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center text-red-600">{error || 'Post not found'}</div>
      </div>
    );
  }

  const canEdit = user?.id === post.author_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Edit Controls */}
      {canEdit && (
        <div className="flex justify-end mb-4 space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </button>
          )}
        </div>
      )}

      {/* Hero Image */}
      <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
        {isEditing ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={editedPost.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Post Header */}
      <div className="mb-8">
        <div className="mb-4">
          {isEditing ? (
            <select
              name="category"
              value={editedPost.category}
              onChange={handleChange}
              className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full"
            >
              <option value="Investment">Investment</option>
              <option value="Design">Design</option>
              <option value="Market Analysis">Market Analysis</option>
            </select>
          ) : (
            <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </div>
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedPost.title}
            onChange={handleChange}
            className="text-4xl font-bold mb-4 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        )}
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <time>{new Date(post.created_at).toLocaleDateString()}</time>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-gray-600 text-sm">Price</div>
          <div className="text-2xl font-bold text-green-600">
            ${post.price.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Location</div>
          <div className="font-medium">{post.location}</div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Area</div>
          <div className="font-medium">{post.sqft.toLocaleString()} sqft</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-600 text-sm">Beds</div>
            <div className="font-medium">{post.bedrooms}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Baths</div>
            <div className="font-medium">{post.bathrooms}</div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              name="excerpt"
              value={editedPost.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown supported)</label>
            <textarea
              name="content"
              value={editedPost.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={editedPost.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={editedPost.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Square Feet
              </label>
              <input
                type="number"
                name="sqft"
                value={editedPost.sqft}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={editedPost.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={editedPost.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="markdown-content"
          >
            {post.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default BlogViewPage; 