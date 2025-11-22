'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, BarChart3, Link2, CheckCircle2, Github, Twitter, Linkedin, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShortURL
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
          
            <Link href="/dashboard">
              <Button>Try Now</Button>
            </Link>
          </div>
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
           
            <Link href="/dashboard" className="block">
              <Button className="w-full">Try Now</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shorten Your Links,<br className="hidden sm:block" /> Expand Your Reach
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Create short, memorable links that are easy to share. Track clicks, analyze performance, and grow your audience with our powerful URL shortener.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="text-base md:text-lg px-6 md:px-8 py-3 w-full sm:w-auto">
                Get Started
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" className="text-base md:text-lg px-6 md:px-8 py-3 w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Why Choose ShortURL?</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Everything you need to manage and track your links effectively
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Lightning Fast</h3>
            <p className="text-gray-600">Instant link generation and redirection with minimal latency</p>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure & Reliable</h3>
            <p className="text-gray-600">Your links are safe with enterprise-grade security and reliability</p>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Analytics</h3>
            <p className="text-gray-600">Track clicks, monitor performance, and gain valuable insights</p>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Link2 className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Custom Slugs</h3>
            <p className="text-gray-600">Create memorable custom codes for your brand and campaigns</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">How It Works</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Get started in three simple steps
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Paste Your URL</h3>
              <p className="text-gray-600">Enter your long URL into our simple form</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Customize (Optional)</h3>
              <p className="text-gray-600">Add a custom code to make it memorable</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Share & Track</h3>
              <p className="text-gray-600">Share your short link and monitor its performance</p>
            </div>
          </div>
        </div>
      </section>

        {/* CTA Section */}
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Ready to Get Started?</h2>
        <p className="text-lg md:text-xl mb-6 md:mb-8 text-blue-100 px-4">
          Join thousands of users who trust ShortURL for their link management needs
        </p>

        <div className="flex justify-center">    {/* Centering container */}
          <Link href="/dashboard">
            <Button
              variant="secondary"
              className="text-base md:text-lg px-6 md:px-8 py-3 bg-white text-blue-600 hover:bg-gray-100"
            >
              Create Your First Link
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>


      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 md:py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">ShortURL</span>
              </div>
              <p className="text-gray-600 text-sm">
                The simplest way to shorten URLs and track their performance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors" aria-label="GitHub">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} ShortURL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
