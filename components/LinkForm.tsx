'use client';

import { useState, FormEvent } from 'react';
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
  const [successMessage, setSuccessMessage] = useState('');
  const [createdLink, setCreatedLink] = useState<CreateLinkResponse | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUrlError('');
    setCodeError('');
    setSuccessMessage('');
    setCreatedLink(null);

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
          customCode: customCode.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setCodeError(data.error || 'This code already exists');
        } else if (response.status === 400) {
          if (data.error.includes('URL')) {
            setUrlError(data.error);
          } else {
            setCodeError(data.error);
          }
        } else {
          setUrlError('Failed to create link. Please try again.');
        }
        return;
      }

      // Success
      const linkData: CreateLinkResponse = data;
      setCreatedLink(linkData);
      setSuccessMessage('Link created successfully!');
      setUrl('');
      setCustomCode('');
      
      // Refresh the links list
      onSuccess();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setCreatedLink(null);
      }, 5000);
    } catch (error) {
      console.error('Error creating link:', error);
      setUrlError('Failed to create link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Add New Short Link</h2>
      
      {successMessage && createdLink && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">✓ {successMessage}</p>
          <p className="text-sm text-green-700 mt-1">
            Short URL: <a href={createdLink.shortUrl} className="underline" target="_blank" rel="noopener noreferrer">{createdLink.shortUrl}</a>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Input
          label="Custom Code"
          type="text"
          value={customCode}
          onChange={(e) => {
            setCustomCode(e.target.value);
            setCodeError('');
          }}
          placeholder="Optional, 6-8 characters"
          error={codeError}
          disabled={isLoading}
          maxLength={8}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Creating...' : 'Create Short Link'}
        </Button>
      </form>
    </div>
  );
}

