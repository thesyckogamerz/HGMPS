"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function Page() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock order data - replace with your actual API call
  const mockOrder = {
    id: "ORD-789456123",
    status: "in_transit",
    statusText: "In Transit",
    estimatedDelivery: "2024-12-20",
    shippedDate: "2024-12-15",
    carrier: "FedEx",
    trackingCode: "789456123ABC",
    items: [
      { name: "Premium Coffee Beans", quantity: 2, price: 24.99 },
      { name: "Ceramic Pour Over Set", quantity: 1, price: 45.50 },
    ],
    shippingAddress: {
      name: "Alex Johnson",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    milestones: [
      { status: "ordered", date: "Dec 12, 2024", time: "10:30 AM", description: "Order Confirmed" },
      { status: "processed", date: "Dec 13, 2024", time: "2:15 PM", description: "Order Processed" },
      { status: "shipped", date: "Dec 15, 2024", time: "9:00 AM", description: "Shipped from Warehouse" },
      { status: "in_transit", date: "Dec 16, 2024", time: "3:45 PM", description: "In Transit - Arrived at Hub" },
      { status: "delivered", date: "", time: "", description: "Out for Delivery" },
    ],
  };

  const statusIcons = {
    ordered: <Clock className="w-5 h-5 text-blue-500" />,
    processed: <Package className="w-5 h-5 text-purple-500" />,
    shipped: <Truck className="w-5 h-5 text-orange-500" />,
    in_transit: <Truck className="w-5 h-5 text-yellow-500" />,
    delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
  };

  const statusColors = {
    ordered: "bg-blue-100 text-blue-800",
    processed: "bg-purple-100 text-purple-800",
    shipped: "bg-orange-100 text-orange-800",
    in_transit: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setIsLoading(false);
      setTrackingNumber("");
    }, 1000);
  };

  const getCurrentStep = () => {
    const steps = ["ordered", "processed", "shipped", "in_transit", "delivered"];
    return steps.indexOf(order.status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your tracking number below to check the status of your shipment
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter your tracking number (e.g., 789456123ABC)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Tracking...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Track Order
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Don&apos;t have a tracking number?{" "}
                <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                  Contact our support team
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Order Tracking Results */}
        {order && (
          <div className="space-y-8">
            {/* Order Status Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order {order.id}</h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                      {statusIcons[order.status]}
                      <span className="ml-2">{order.statusText}</span>
                    </span>
                    <span className="text-gray-500 text-sm">
                      Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                    Download Shipping Label
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-10">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Ordered</span>
                  <span>Processed</span>
                  <span>Shipped</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${(getCurrentStep() / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-full w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {order.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex items-start ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-4`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= getCurrentStep() ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        {index < getCurrentStep() ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${index <= getCurrentStep() ? "bg-white" : "bg-gray-400"}`} />
                        )}
                      </div>
                      <div
                        className={`flex-1 bg-gray-50 rounded-xl p-4 ${
                          index % 2 === 0 ? "md:mr-auto md:max-w-md" : "md:ml-auto md:max-w-md md:text-right"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">{milestone.description}</h3>
                          <span className="text-sm text-gray-500">
                            {milestone.date && `${milestone.date} • ${milestone.time}`}
                          </span>
                        </div>
                        {index === getCurrentStep() && (
                          <p className="mt-2 text-sm text-blue-600 font-medium">
                            Your package is currently at this stage
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>
                        $
                        {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                    <div className="text-gray-900">
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Carrier</h4>
                      <p className="font-medium text-gray-900">{order.carrier}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Tracking Code</h4>
                      <p className="font-medium text-gray-900 font-mono">{order.trackingCode}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Shipped Date</h4>
                      <p className="font-medium text-gray-900">
                        {new Date(order.shippedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Est. Delivery</h4>
                      <p className="font-medium text-gray-900">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={`https://www.fedex.com/fedextrack/?trknbr=${order.trackingCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Truck className="w-4 h-4" />
                      Track on {order.carrier} website
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Support CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Need Help With Your Order?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our customer support team is here to help with any questions about your shipment
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="/faq"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition-colors"
                >
                  View FAQs
                </a>
              </div>
            </div>
          </div>
        )}

        {/* No order tracked yet */}
        {!order && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to track your order?</h3>
              <p className="text-gray-600 mb-8">
                Enter your tracking number above to see real-time updates on your shipment&apos;s progress,
                estimated delivery date, and more.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Where to find your tracking number:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    Order confirmation email
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    Shipping confirmation SMS
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    Your account order history
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    Shipping label on package
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}