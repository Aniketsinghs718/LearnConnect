
'use client';

import React, { useState, useEffect } from 'react';
import { MarketplaceCategory, CreateItemData } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplace';
import { supabase } from '../../lib/supabaseClient';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

export const SellItemForm: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);const [formData, setFormData] = useState<CreateItemData>({
    title: '',
    description: '',
    category_id: '',
    price: 0,
    condition: 'good',
    college_name: '',
    size: undefined,
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  useEffect(() => {
    loadCategories();
    loadUserProfile();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await MarketplaceService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadUserProfile = async () => {
    try {
      // First try to get from localStorage
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        setFormData(prev => ({
          ...prev,
          college_name: profile.college || ''
        }));
        return;
      }

      // If not in localStorage, try to get from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('college')
          .eq('id', user.id)
          .single();
        
        if (userData?.college) {
          setFormData(prev => ({
            ...prev,
            college_name: userData.college
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Don't show error toast for this as it's not critical
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate image formats - Supabase Storage supports: JPEG, PNG, GIF, WebP
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const unsupportedFiles = files.filter(file => !supportedFormats.includes(file.type));
    
    if (unsupportedFiles.length > 0) {
      toast.error(`Unsupported image format. Please use JPEG, PNG, GIF, or WebP files only.`);
      return;
    }

    const newImages = [...formData.images, ...files];
    setFormData(prev => ({ ...prev, images: newImages }));

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Cleanup URL
    URL.revokeObjectURL(imagePreviews[index]);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }
    
    if (formData.price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    // Show disclaimer before proceeding
    setShowDisclaimer(true);
  };

  const proceedWithListing = async () => {
    setShowDisclaimer(false);
    
    try {
      setLoading(true);
      
      // Get current user and ensure authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error('Please log in to list an item');
        router.push('/auth/login');
        return;
      }

      // Check if user profile exists in database
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile) {
        toast.error('User profile not found. Please complete your registration.');
        router.push('/auth/profile');
        return;
      }      console.log('Creating item with user ID:', user.id);
      
      // Create item
      const itemId = await MarketplaceService.createItem(formData, user.id);
      
      // Show verification message
      setShowVerificationMessage(true);
      
      // Hide verification message after 3 seconds and redirect
      setTimeout(() => {
        setShowVerificationMessage(false);
        toast.success('Item listed successfully!');
        router.push('/marketplace');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error creating item:', error);
      
      // Handle specific RLS errors
      if (error?.message?.includes('row-level security policy') || 
          error?.statusCode === '403' || 
          error?.error === 'Unauthorized') {
        toast.error('Authentication error. Please log in again.');
        router.push('/auth/login');
      } else {
        toast.error('Failed to list item. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-white mb-6">
            📦 List Your Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Physics Textbook Class 12"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your item's condition, usage, and any other details..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>              {/* College Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  College Name <span className="text-xs text-gray-500">(Auto-filled from profile)</span>
                </label>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleInputChange}
                  placeholder="Auto-filled from your profile..."
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Size Field - Only for Aprons */}
            {categories.find(cat => cat.id === formData.category_id)?.name?.includes('Apron') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Size *
                </label>
                <select
                  name="size"
                  value={formData.size || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Size</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                </select>
              </div>
            )}

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Images * (Max 5)
              </label>
              
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-800/50"><input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={formData.images.length >= 5}
                />                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${
                    formData.images.length >= 5 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-orange-400 hover:text-orange-300'
                  }`}
                >
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm">
                    {formData.images.length >= 5 
                      ? 'Maximum 5 images reached'
                      : 'Click to upload images or drag and drop'
                    }
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPEG, PNG, GIF, WebP up to 10MB each
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <span>📤</span>
                  <span>List Item</span>
                </>
              )}            </button>
          </form>
        </div>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Important Notice
                </h3>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6 space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2">⚠️ Fraud Prevention Notice</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Any inappropriate content, fraudulent listings, or misleading information will result in:
                </p>
                <ul className="text-gray-400 text-sm mt-2 space-y-1">
                  <li>• Immediate item removal</li>
                  <li>• Account suspension or permanent ban</li>
                  <li>• Reporting to college authorities</li>
                  <li>• Legal action if necessary</li>
                </ul>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="text-orange-400 font-semibold mb-2">📋 Guidelines</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Only list genuine, owned items</li>
                  <li>• Provide accurate descriptions and photos</li>
                  <li>• Set fair and reasonable prices</li>
                  <li>• Be respectful in all communications</li>
                </ul>
              </div>
              
              <p className="text-gray-300 text-sm">
                By proceeding, you agree to these terms and confirm that your listing complies with our community guidelines.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={proceedWithListing}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                I Agree, Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Message Modal */}
      {showVerificationMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Item Submitted Successfully!
            </h3>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-300">
                Your item has been submitted for admin verification.
              </p>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-orange-400 text-sm font-medium">
                  📋 What happens next:
                </p>
                <ul className="text-gray-400 text-sm mt-2 space-y-1 text-left">
                  <li>• Admin will review your listing</li>
                  <li>• Verification usually takes 24-48 hours</li>
                  <li>• You'll be notified once approved</li>
                  <li>• Item will appear in marketplace after approval</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center justify-center text-gray-400 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-400 border-t-transparent mr-2"></div>
              Redirecting to marketplace...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
