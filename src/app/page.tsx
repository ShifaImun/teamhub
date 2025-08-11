import Link from "next/link";
import QuickStats from "@/components/QuickStats";

export default function Home() {
  const features = [
    {
      title: "Employee Directory",
      description: "Find and connect with your team members",
      icon: "👥",
      href: "/directory",
    },
    {
      title: "Celebrations",
      description: "Never miss a birthday or work anniversary",
      icon: "🎉",
      href: "/celebrations",
    },
    {
      title: "Announcements",
      description: "Stay informed with the latest company news",
      icon: "📢",
      href: "/announcements",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
          <span className="text-white font-bold text-2xl">T</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Welcome to TeamHub
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your modern employee portal for team collaboration, communication, and celebration.
          Connect with colleagues, stay informed, and build a stronger workplace community.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-6">
            Explore the features above or sign in to access your personalized dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Browse Directory
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
