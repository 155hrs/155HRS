import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center mb-16">
          {/* Row 1 */}
          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/on-the-way-home-logo.jpg" alt="On The Way Home" className="w-full h-full object-cover" />
          </div>

          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/house-of-harmony-red-logo.jpg" alt="House of Harmony" className="w-full h-full object-cover" />
          </div>

          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/green-circular-glowing-logo.jpg" alt="Central Logo" className="w-full h-full object-cover" />
          </div>

          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/parayre-elegant-serif-logo.jpg" alt="Parayre" className="w-full h-full object-cover" />
          </div>

          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/bottega-veneta-red-logo.jpg" alt="Bottega Veneta" className="w-full h-full object-cover" />
          </div>

          {/* Row 2 */}
          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/audemars-piguet-watch-logo.jpg" alt="Audemars Piguet" className="w-full h-full object-cover" />
          </div>

          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/thelios-blue-white-logo.jpg" alt="Thelios" className="w-full h-full object-cover" />
          </div>

          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/pav-white-geometric-logo.jpg" alt="PAV" className="w-full h-full object-cover" />
          </div>

          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/golden-eye-illustration-logo.jpg" alt="Eye Logo" className="w-full h-full object-cover" />
          </div>

          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="/155hrs-red-bold-logo.jpg" alt="155HRS" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-full h-px bg-gray-700 mb-16"></div>

        <div className="flex items-center justify-center gap-12">
          {/* Left group: Blurb and social media */}
          <div className="flex items-start gap-8">
            <p className="text-gray-300 leading-relaxed text-sm max-w-xs">
              I create creative experiences that blend technology and storytelling to make people feel connected.
            </p>

            <div className="space-y-2 text-gray-400 text-sm">
              <p>instagram ↗</p>
              <p>linkedin ↗</p>
              <p>belinda.cv ↗</p>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="w-px h-24 bg-gray-600"></div>

          {/* Right group: Currently and projects */}
          <div className="flex items-start gap-8">
            <p className="text-gray-300 text-sm whitespace-nowrap">currently...</p>

            <div className="text-gray-400 text-xs space-y-1 max-w-xs">
              <p>designing volcanroom's events</p>
              <p>designing the experience at EY's new headquarters</p>
              <p>branding fast dinner (instagram coming soon)</p>
              <p>designing a member innovation lab & arts & climate collective</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
