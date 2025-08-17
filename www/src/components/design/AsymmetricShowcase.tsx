import React from 'react'
import AsymmetricWrapper from './AsymmetricWrapper'
import FloatingSidebar from '../FloatingSidebar'

const AsymmetricShowcase: React.FC = () => {
  return (
    <div className="p-8">
      <AsymmetricWrapper>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h3 className="text-2xl font-thin mb-2">Asymmetric UI Showcase</h3>
            <p className="text-sm text-white/70 mb-4">Re-using the project's floating sidebar and asymmetric background primitives.</p>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-white/3">Left column content</div>
              <div className="p-4 border rounded-md bg-white/3">More content</div>
            </div>
          </div>
          <div className="w-80">
            <FloatingSidebar />
          </div>
        </div>
      </AsymmetricWrapper>
    </div>
  )
}

export default AsymmetricShowcase
