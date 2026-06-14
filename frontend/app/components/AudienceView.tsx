"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  ShoppingBag,
  TrendingUp,
  Tag,
  RefreshCw,
  UserCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { getCustomers, getCustomerStats, getCities, type Customer, type CustomerStats } from "../lib/api";

export default function AudienceView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("total_spent");
  const [total, setTotal] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit: 50, sort_by: sortBy, sort_order: "desc" };
      if (search) params.search = search;
      if (selectedCity) params.city = selectedCity;
      if (selectedTag) params.tag = selectedTag;

      const [customerData, statsData, citiesData] = await Promise.all([
        getCustomers(params),
        getCustomerStats(),
        getCities(),
      ]);
      setCustomers(customerData.customers);
      setTotal(customerData.total);
      setStats(statsData);
      setCities(citiesData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    setLoading(false);
  }, [search, selectedCity, selectedTag, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const tagColors: Record<string, string> = {
    "high-value": "bg-amber-50 text-amber-700 border-amber-200",
    "vip": "bg-purple-50 text-purple-700 border-purple-200",
    "frequent-buyer": "bg-blue-50 text-blue-700 border-blue-200",
    "new-customer": "bg-green-50 text-green-700 border-green-200",
    "at-risk": "bg-orange-50 text-orange-700 border-orange-200",
    "dormant": "bg-red-50 text-red-700 border-red-200",
    "deal-seeker": "bg-cyan-50 text-cyan-700 border-cyan-200",
    "brand-loyal": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "seasonal-buyer": "bg-pink-50 text-pink-700 border-pink-200",
  };

  const allTags = ["high-value", "vip", "frequent-buyer", "new-customer", "at-risk", "dormant", "deal-seeker", "brand-loyal", "seasonal-buyer"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111] mb-2">Audience</h1>
        <p className="text-[#666]">Explore and understand your customer base</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Customers" value={stats.total_customers.toString()} color="#4F46E5" />
          <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.total_revenue)} color="#10B981" />
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total_orders.toString()} color="#F59E0B" />
          <StatCard icon={TrendingUp} label="Avg Spend" value={formatCurrency(stats.avg_spent)} color="#8B5CF6" />
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
            />
          </div>

          {/* City Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 bg-[#F5F5F7] rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 cursor-pointer"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#999]" />
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 bg-[#F5F5F7] rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 cursor-pointer"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#999]" />
          </div>

          {/* Sort */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 bg-[#F5F5F7] rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 cursor-pointer"
            >
              <option value="total_spent">Top Spenders</option>
              <option value="total_orders">Most Orders</option>
              <option value="joined_at">Newest First</option>
              <option value="name">A-Z Name</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#999]" />
          </div>

          <motion.button
            onClick={fetchData}
            className="p-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#EEEEF0] transition-colors"
            whileTap={{ rotate: 180 }}
          >
            <RefreshCw className="w-4 h-4 text-[#666]" />
          </motion.button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[#999] mb-4">
        Showing <span className="font-semibold text-[#111]">{customers.length}</span> of{" "}
        <span className="font-semibold text-[#111]">{total}</span> customers
      </p>

      {/* Customer Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-[#4F46E5] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(0,0,0,0.06)]">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-[#999] uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-[#999] uppercase tracking-wider hidden sm:table-cell">City</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-[#999] uppercase tracking-wider">Spent</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-[#999] uppercase tracking-wider hidden md:table-cell">Orders</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-[#999] uppercase tracking-wider hidden lg:table-cell">Tags</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-[#999] uppercase tracking-wider hidden xl:table-cell">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-[rgba(0,0,0,0.04)] hover:bg-[rgba(79,70,229,0.02)] cursor-pointer transition-colors"
                    onClick={() => setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer)}
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#111] truncate">{customer.name}</p>
                          <p className="text-xs text-[#999] truncate">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 hidden sm:table-cell">
                      <span className="text-sm text-[#666]">{customer.city}</span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="text-sm font-semibold text-[#111]">{formatCurrency(customer.total_spent)}</span>
                    </td>
                    <td className="py-3.5 px-5 text-right hidden md:table-cell">
                      <span className="text-sm text-[#666]">{customer.total_orders}</span>
                    </td>
                    <td className="py-3.5 px-5 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border ${tagColors[tag] || "bg-gray-50 text-gray-700 border-gray-200"}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {customer.tags.length > 2 && (
                          <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-50 text-gray-500">
                            +{customer.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 hidden xl:table-cell">
                      <span className="text-xs text-[#999]">
                        {customer.last_order_date
                          ? new Date(customer.last_order_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expanded Customer Detail */}
      {selectedCustomer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mt-4"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-xl font-bold">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111]">{selectedCustomer.name}</h3>
                <p className="text-sm text-[#666]">{selectedCustomer.email} | {selectedCustomer.phone}</p>
                <p className="text-xs text-[#999] mt-1">{selectedCustomer.gender}, {selectedCustomer.age} yrs | {selectedCustomer.city} | Joined {new Date(selectedCustomer.joined_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
              </div>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="text-[#999] hover:text-[#111] text-sm">Close</button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-[#F5F5F7] rounded-xl p-3 text-center">
              <p className="text-xs text-[#999]">Total Spent</p>
              <p className="text-lg font-bold text-[#4F46E5]">{formatCurrency(selectedCustomer.total_spent)}</p>
            </div>
            <div className="bg-[#F5F5F7] rounded-xl p-3 text-center">
              <p className="text-xs text-[#999]">Orders</p>
              <p className="text-lg font-bold text-[#111]">{selectedCustomer.total_orders}</p>
            </div>
            <div className="bg-[#F5F5F7] rounded-xl p-3 text-center">
              <p className="text-xs text-[#999]">Avg Order</p>
              <p className="text-lg font-bold text-[#111]">{formatCurrency(selectedCustomer.total_spent / (selectedCustomer.total_orders || 1))}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCustomer.tags.map((tag) => (
              <span key={tag} className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${tagColors[tag] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#111]">{value}</p>
      <p className="text-xs text-[#999] mt-1">{label}</p>
    </motion.div>
  );
}
