
import { Book, Home, Wrench, Calendar, Shield, Leaf } from 'lucide-react';

const HomeOwnerManualPage = () => {
  const maintenanceTasks = [
    {
      title: 'Monthly Tasks',
      icon: Calendar,
      tasks: [
        'Test smoke and carbon monoxide detectors',
        'Clean/replace HVAC filters',
        'Clean kitchen sink disposal',
        'Inspect fire extinguishers'
      ]
    },
    {
      title: 'Seasonal Tasks',
      icon: Leaf,
      tasks: [
        'Clean gutters and downspouts',
        'Inspect roof and chimney',
        'Service HVAC system',
        'Check weather stripping and seals'
      ]
    },
    {
      title: 'Annual Tasks',
      icon: Wrench,
      tasks: [
        'Professional HVAC inspection',
        'Drain water heater',
        'Inspect and repair grout/caulk',
        'Test sump pump and backup'
      ]
    }
  ];

  const emergencyContacts = [
    { service: 'Emergency Services', number: '911' },
    { service: 'Poison Control', number: '1-800-222-1222' },
    { service: 'Local Police (non-emergency)', number: '555-0123' },
    { service: 'Local Fire Department', number: '555-0124' },
    { service: 'Gas Company', number: '555-0125' },
    { service: 'Electric Company', number: '555-0126' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Book className="h-8 w-8 mr-2 text-blue-600" />
          Home Owner's Manual
        </h1>
        <p className="text-lg text-gray-600">
          Your comprehensive guide to maintaining and protecting your home
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Home className="h-6 w-6 mr-2 text-blue-600" />
          Quick Start Guide
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            Welcome to your comprehensive home owner's manual! This guide will help you maintain
            your home and handle common household issues. Regular maintenance can prevent costly
            repairs and extend the life of your home's systems and appliances.
          </p>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {maintenanceTasks.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <IconComponent className="h-5 w-5 mr-2 text-blue-600" />
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2 mt-0.5">
                      {taskIndex + 1}
                    </span>
                    <span className="text-gray-600">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600" />
          Emergency Contacts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex justify-between p-4 bg-gray-50 rounded-md">
              <span className="font-medium text-gray-900">{contact.service}</span>
              <span className="text-blue-600">{contact.number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Home Systems Guide */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Important Tips</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            • Know the location of your main water shut-off valve and circuit breaker panel
          </p>
          <p>
            • Keep basic tools and emergency supplies readily available
          </p>
          <p>
            • Document all home maintenance and repairs for future reference
          </p>
          <p>
            • Consider creating a home maintenance fund for unexpected repairs
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeOwnerManualPage; 