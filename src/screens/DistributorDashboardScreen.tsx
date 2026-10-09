import React, { useState } from 'react';
import { UserSession } from '../types';
import { AppIcon } from '../components/AppIcon';

interface DistributorDashboardScreenProps {
  userSession: UserSession;
  onSwitchRole: () => void;
  onToast: (msg: string) => void;
}

export const DistributorDashboardScreen: React.FC<DistributorDashboardScreenProps> = ({
  userSession,
  onSwitchRole,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('orders');

  const [orders, setOrders] = useState([
    {
      id: 'DIS-1049',
      contractor: 'Amit Verma (Master Painter)',
      items: '40L Asian Paints Royal Emulsion + 2L Waterproof Primer',
      deliveryAddress: 'Block C, Saket Project Site',
      amount: '₹14,200',
      status: 'pending',
      time: '15 mins ago',
    },
    {
      id: 'DIS-1042',
      contractor: 'Sanjay Yadav (Master Plumber)',
      items: '12x 1" CPVC Pipes + 24 Brass Elbow Connectors',
      deliveryAddress: 'Green Park Market Flat 3',
      amount: '₹6,450',
      status: 'dispatched',
      time: '2 hrs ago',
    },
    {
      id: 'DIS-1038',
      contractor: 'Manoj Panchal (Wood Artisan)',
      items: '8x Teak Plywood Sheets (19mm) + Fevicol SH (10kg)',
      deliveryAddress: 'Hauz Khas Studio 12',
      amount: '₹18,900',
      status: 'delivered',
      time: 'Yesterday',
    },
  ]);

  const inventory = [
    { name: 'Asian Paints Royal Luxury Emulsion (20L)', stock: '34 tubs', price: '₹4,850', status: 'In Stock' },
    { name: 'Berger Dampstop Moisture Sealant (10L)', stock: '18 tubs', price: '₹2,600', status: 'In Stock' },
    { name: 'Astral Heavy Flow CPVC Pipes (3m)', stock: '120 pcs', price: '₹340', status: 'In Stock' },
    { name: 'Jaquar Ceramic Quarter Turn Valve Cartridge', stock: '8 pcs', price: '₹620', status: 'Low Stock' },
    { name: 'Commercial Marine Grade Plywood (19mm)', stock: '45 sheets', price: '₹2,100', status: 'In Stock' },
    { name: 'Havells Modular 16A Switches & Sockets Box', stock: '60 boxes', price: '₹890', status: 'In Stock' },
  ];

  const handleDispatch = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'dispatched' } : o))
    );
    onToast(`Order ${orderId} marked as dispatched! Contractor notified.`);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-[#FAFAFA]">
      {/* Distributor Header */}
      <div className="sticky top-0 z-20 bg-[#111111] text-white px-4 pt-3 pb-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-[15px]">
              <AppIcon name="truck" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[16px] font-bold leading-tight">
                  {userSession.businessName || 'Metro Supplies Hub'}
                </h2>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E9F6EC] text-[#1E7A34]">
                  Verified
                </span>
              </div>
              <p className="text-[11.5px] text-[#A3A3A3] leading-tight">
                Wholesale Distributor & Store Portal · {userSession.city}
              </p>
            </div>
          </div>

          <button
            onClick={onSwitchRole}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11.5px] font-bold transition-colors"
          >
            Switch Role
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
          <div>
            <span className="text-[10.5px] text-[#A3A3A3] font-semibold block">TODAY ORDERS</span>
            <span className="text-[16px] font-black text-white">₹39,550</span>
          </div>
          <div>
            <span className="text-[10.5px] text-[#A3A3A3] font-semibold block">DISPATCHED</span>
            <span className="text-[16px] font-black text-[#4ADE80]">8 Shipments</span>
          </div>
          <div>
            <span className="text-[10.5px] text-[#A3A3A3] font-semibold block">STORE RATING</span>
            <span className="text-[16px] font-black text-[#FEF08A] flex items-center justify-center gap-0.5">
              <AppIcon name="star" size={12} className="fill-[#EAB308] text-[#EAB308]" /> 4.9
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white/10 rounded-xl">
          {[
            { id: 'orders', label: 'B2B Orders' },
            { id: 'inventory', label: 'Stock Catalog' },
            { id: 'analytics', label: 'Wholesale Ledger' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#D4D4D4] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* TAB 1: B2B CONTRACTOR ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#111111]">Contractor Material Requisitions</h3>
              <span className="text-[12px] text-[#888888]">{orders.length} active</span>
            </div>

            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-[#888888] tracking-wider uppercase">
                        {o.id}
                      </span>
                      <span
                        className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
                          o.status === 'pending'
                            ? 'bg-[#FEF9C3] text-[#CA8A04] border-[#EAB308]/30'
                            : o.status === 'dispatched'
                            ? 'bg-[#E9F6EC] text-[#1E7A34] border-[#1E7A34]/25'
                            : 'bg-[#F5F5F5] text-[#555555] border-[#E0E0E0]'
                        }`}
                      >
                        {o.status === 'pending' ? 'Ready to Ship' : o.status === 'dispatched' ? 'Dispatched' : 'Delivered'}
                      </span>
                    </div>
                    <h4 className="text-[14.5px] font-bold text-[#111111] mt-1">{o.contractor}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[16px] font-black text-[#111111]">{o.amount}</span>
                    <span className="text-[10.5px] text-[#888888] block">{o.time}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F9F9F9] border border-[#F0F0F0] space-y-1 text-[12px]">
                  <div className="font-semibold text-[#111111]">{o.items}</div>
                  <div className="text-[#6B6B6B] flex items-center gap-1.5">
                    <AppIcon name="pin" size={13} className="text-[#888888]" />
                    <span>{o.deliveryAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {o.status === 'pending' ? (
                    <button
                      onClick={() => handleDispatch(o.id)}
                      className="w-full h-10 rounded-xl bg-[#111111] text-white text-[12.5px] font-bold hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-1.5"
                    >
                      <AppIcon name="truck" size={15} />
                      Dispatch Delivery Vehicle
                    </button>
                  ) : (
                    <button
                      onClick={() => onToast(`Tracking dispatched driver for order ${o.id}...`)}
                      className="w-full h-10 rounded-xl border border-[#E5E5E5] text-[12.5px] font-bold text-[#111111] hover:bg-[#F5F5F5] flex items-center justify-center gap-1.5"
                    >
                      <AppIcon name="navigate" size={15} />
                      Track Delivery Vehicle
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: INVENTORY & CATALOG */}
        {activeTab === 'inventory' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#111111]">Store Raw Material Catalog</h3>
              <button
                onClick={() => onToast('Add new wholesale product')}
                className="text-[12px] font-bold text-[#111111] flex items-center gap-1"
              >
                <AppIcon name="plus" size={14} /> Add Product
              </button>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-2xl divide-y divide-[#F0F0F0] overflow-hidden">
              {inventory.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between">
                  <div className="pr-2">
                    <h4 className="text-[13.5px] font-bold text-[#111111]">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-[#6B6B6B]">
                      <span>Stock: {item.stock}</span>
                      <span>·</span>
                      <span
                        className={`font-semibold ${
                          item.status === 'Low Stock' ? 'text-[#C23B3B]' : 'text-[#1E7A34]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[14px] font-black text-[#111111]">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WHOLESALE LEDGER */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
                <span className="text-[11.5px] text-[#888888] font-bold block">MONTHLY TURNOVER</span>
                <span className="text-[20px] font-black text-[#111111] mt-0.5 block">₹4,28,000</span>
                <span className="text-[11.5px] text-[#1E7A34] font-semibold">+22% B2B Growth</span>
              </div>
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
                <span className="text-[11.5px] text-[#888888] font-bold block">ACTIVE PARTNERS</span>
                <span className="text-[20px] font-black text-[#111111] mt-0.5 block">62 Pros</span>
                <span className="text-[11.5px] text-[#888888]">Painters, Plumbers</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] space-y-2">
              <h4 className="text-[14px] font-bold text-[#111111]">Direct Supply Network</h4>
              <p className="text-[12.5px] text-[#6B6B6B] leading-relaxed">
                As a verified distributor on OnnCall, your inventory is directly recommended to service technicians whenever a customer books a painting, plumbing, or carpentry package in your locality.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
