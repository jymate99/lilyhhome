import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Edit, Save, X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { uploadImage } from '../utils/imageUpload';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);

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
    setImageFile(null);
    setImagePreview('');
    setEditedPost(post || {});
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditedPost({
      ...editedPost,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Update editedPost with temporary preview
      setEditedPost({
        ...editedPost,
        image_url: previewUrl
      });

      // Clean up the old preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleImageDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      if (post?.image_url && post.image_url.includes('property-images')) {
        const oldImagePath = post.image_url.split('/').pop();
        if (oldImagePath) {
          const { error: storageError } = await supabase.storage
            .from('property-images')
            .remove([oldImagePath]);
          
          if (storageError) throw storageError;

          // Update the post to remove the image_url
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ image_url: '' })
            .eq('id', id);

          if (updateError) throw updateError;

          // Update local state
          setPost({
            ...post,
            image_url: ''
          });
          setEditedPost({
            ...editedPost,
            image_url: ''
          });
          setImageFile(null);
          setImagePreview('');
        }
      }
    } catch (err) {
      setError('Failed to delete image');
      console.error('Error:', err);
    }
  };

  const handleSave = async () => {
    try {
      setUploadLoading(true);
      let finalImageUrl = editedPost.image_url;

      if (imageFile) {
        // Delete old image if it exists and is from our storage
        if (post?.image_url && post.image_url.includes('property-images')) {
          const oldImagePath = post.image_url.split('/').pop();
          if (oldImagePath) {
            await supabase.storage
              .from('property-images')
              .remove([oldImagePath]);
          }
        }

        // Upload new image
        finalImageUrl = await uploadImage(imageFile);
      }

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          ...editedPost,
          image_url: finalImageUrl
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setPost({
        ...editedPost,
        image_url: finalImageUrl
      } as BlogPost);
      
      // Reset image states
      setImageFile(null);
      setImagePreview('');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update blog post');
      console.error('Error:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete the image from storage if it exists
      if (post?.image_url && post.image_url.includes('property-images')) {
        const oldImagePath = post.image_url.split('/').pop();
        if (oldImagePath) {
          const { error: storageError } = await supabase.storage
            .from('property-images')
            .remove([oldImagePath]);
          
          if (storageError) {
            console.error('Error deleting image:', storageError);
          }
        }
      }

      // Then delete the post
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      navigate('/blog', { 
        replace: true,
        state: { message: 'Post deleted successfully' }
      });
    } catch (err) {
      setError('Failed to delete post');
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
                disabled={uploadLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300"
              >
                <Save className="h-4 w-4 mr-2" />
                {uploadLoading ? 'Saving...' : 'Save'}
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
            <>
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* Hero Image */}
      <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
        {isEditing ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Property Image</label>
            <div className="mt-1 flex flex-col items-center">
              {(imagePreview || editedPost.image_url) ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview || editedPost.image_url}
                    alt="Preview"
                    className="w-full h-[400px] object-cover rounded-lg mb-4"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <label 
                      className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                      title="Upload new image"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Edit className="h-4 w-4" />
                    </label>
                    <button
                      onClick={handleImageDelete}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                      title="Delete image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <label className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        ) : (
          post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-gray-500">No image available</p>
            </div>
          )
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