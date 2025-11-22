'use client';

import { useState, FormEvent } from 'react';
import { Plus, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from './ui/Input';
import Button from './ui/Button';
import { isValidUrl, isValidCode } from '@/lib/validation';
import type { CreateLinkResponse } from '@/types';

interface LinkFormProps {
  onSuccess: () => void;
}

export default function LinkForm({ onSuccess }: LinkFormProps) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [urlError, setUrlError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUrlError('');
    setCodeError('');

    // Validate URL
    if (!url.trim()) {
      setUrlError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    // Validate custom code if provided
    if (customCode && !isValidCode(customCode)) {
      setCodeError('Code must be 6-8 alphanumeric characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          customCode: customCode.trim().toLowerCase() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setCodeError(data.error || 'This code already exists');
          toast.error(data.error || 'This code already exists');
        } else if (response.status === 400) {
          if (data.error.includes('URL')) {
            setUrlError(data.error);
            toast.error(data.error);
          } else {
            setCodeError(data.error);
            toast.error(data.error);
          }
        } else {
          setUrlError('Failed to create link. Please try again.');
          toast.error('Failed to create link. Please try again.');
        }
        return;
      }

      // Success
      const linkData: CreateLinkResponse = data;
      toast.success('Link created successfully!');
      setUrl('');
      setCustomCode('');
      
      // Refresh the links list
      onSuccess();
    } catch (error) {
      console.error('Error creating link:', error);
      setUrlError('Failed to create link. Please try again.');
      toast.error('Failed to create link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-white/20 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Short Link</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            label="Long URL"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError('');
            }}
            placeholder="https://example.com/very/long/url/path"
            required
            error={urlError}
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            label="Custom Code (Optional)"
            type="text"
            value={customCode}
            onChange={(e) => {
              setCustomCode(e.target.value);
              setCodeError('');
            }}
            placeholder="6-8 alphanumeric characters"
            error={codeError}
            disabled={isLoading}
            maxLength={8}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <Link2 className="w-4 h-4" />
          {isLoading ? 'Creating...' : 'Create Short Link'}
        </Button>
      </form>
    </div>
  );
}

