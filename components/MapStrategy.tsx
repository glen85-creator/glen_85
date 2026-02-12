
import React, { useState } from 'react';
import { 
  MapPin, 
  Info, 
  Layers, 
  Crosshair, 
  Filter, 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Target,
  ArrowUpRight,
  Map as MapIcon,
  Navigation,
  Eye,
  EyeOff
} from 'lucide-react';

const mockStores = [
  { id: '1', name: '강남 삼성타운점', brand: 'HBS Premium', sales: '+18.5%', status: 'Active', address: '서울 강남구 테헤란로', x: 45, y: 40, type: 'internal' },
  { id: '2', name: '서초 본점', brand: 'HBS Black', sales: '+12.2%', status: 'Active', address: '서울 서초구 반포동', x: 30, y: 55, type: 'internal' },
  { id: '3', name: '잠실 롯데타워점', brand: 'HBS Premium', sales: '+5.7%', status: 'Warning', address: '서울 송파구 잠실동', x: 75, y: 35, type: 'internal' },
  { id: '4', name: '압구정 로데오', brand: 'HBS Classic', sales: '-2.1%', status: 'Active', address: '서울 강남구 신사동', x: 55, y: 25, type: 'internal' },
  { id: 'comp1', name: '경쟁사 A 압구정', brand: 'Competitor', sales: 'N/A', status: 'Competitor', address: '서울 강남구 신사동', x: 58, y: 28, type: 'competitor' },
  { id: 'comp2', name: '경쟁사 B 강남역', brand: 'Competitor', sales: 'N/A', status: 'Competitor', address: '서울 강남구 역삼동', x: 42, y: 43, type: 'competitor' },
  { id: 'comp3', name: '경쟁사 C 잠실', brand: 'Competitor', sales: 'N/A', status: 'Competitor', address: '서울 송파구 신천동', x: 72, y: 32, type: 'competitor' },
];

const MapStrategy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>('1');
  const [showRadius, setShowRadius] = useState(true);

  const filteredStores = mockStores.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden animate-in fade-in duration-500">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="매장명, 지역, 상권 키워드로 검색..." 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowRadius(!showRadius)}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-tight border transition-all ${
                showRadius ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              {showRadius ? <Eye size={14} /> : <EyeOff size={14} />}
              반경 300m 시각화
            </button>
            <div className="relative group">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select className="bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase pl-9 pr-8 py-3.5 outline-none appearance-none cursor-pointer">
                <option>전체 매장 보기</option>
                <option>자사 매장만</option>
                <option>경쟁사 매장만</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:opacity-90 transition-all">
            <Target size={14} />
            중첩 상권 분석
          </button>
        </div>
      </div>

      {/* Map & List Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Map Content */}
        <div className="flex-1 bg-white rounded-[48px] shadow-sm border border-gray-100 relative overflow-hidden group">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-[#F1F3F5] flex items-center justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
            
            {/* SVG Overlays for Radius and Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Radius Circles */}
              {showRadius && mockStores.map(store => (
                <g key={`radius-${store.id}`}>
                  <circle 
                    cx={`${store.x}%`} 
                    cy={`${store.y}%`} 
                    r="60" 
                    fill={store.type === 'internal' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(244, 63, 94, 0.12)'}
                    stroke={store.type === 'internal' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(244, 63, 94, 0.3)'}
                    strokeWidth="1"
                  />
                  {/* Circle outline for better visibility of overlap boundaries */}
                  <circle 
                    cx={`${store.x}%`} 
                    cy={`${store.y}%`} 
                    r="60" 
                    fill="none"
                    stroke={store.type === 'internal' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(244, 63, 94, 0.2)'}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                </g>
              ))}

              {/* Road Lines (Mock) */}
              <path d="M0,100 L1000,400 M200,0 L500,800 M0,600 L1000,200" stroke="black" strokeWidth="2" strokeOpacity="0.05" fill="none" />
            </svg>

            <div className="flex flex-col items-center">
              <Navigation size={40} className="text-gray-200 mb-4" />
              <p className="text-xs font-bold text-gray-300">중첩 구역(Overlap)을 분석하여 전략을 수립하세요</p>
            </div>

            {/* Markers */}
            {mockStores.map(store => (
              <div 
                key={store.id}
                className="absolute cursor-pointer transition-transform hover:scale-125 z-20"
                style={{ left: `${store.x}%`, top: `${store.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => setSelectedStore(store.id)}
              >
                <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${
                  store.type === 'internal' ? 'bg-purple-600' : 'bg-rose-500'
                }`}></div>
                {selectedStore === store.id && (
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max whitespace-nowrap bg-black text-white text-[10px] font-black px-2 py-1 rounded shadow-xl">
                      {store.name}
                   </div>
                )}
              </div>
            ))}
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 w-72 z-10">
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info size={16} className="text-purple-600" />
                  상권 범례
              </h4>
              <div className="space-y-3">
                  <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-purple-600/20 border border-purple-600/40"></div>
                      <span className="text-[11px] font-bold text-gray-600">자사 매장 반경 (300m)</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-rose-500/20 border border-rose-500/40"></div>
                      <span className="text-[11px] font-bold text-gray-600">경쟁 매장 반경 (300m)</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">상권 중첩 지수</span>
                        <span className="text-xs font-black text-rose-500">주의</span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed">자사-경쟁사 반경이 중첩되는 구간은 밀착 방어 또는 프로모션 전략이 필요합니다.</p>
                  </div>
              </div>
          </div>

          {/* Action Controls */}
          <div className="absolute top-8 right-8 flex flex-col gap-2 z-10">
              <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center text-gray-600 hover:text-black transition-all"><Crosshair size={22} /></button>
              <div className="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden mt-2">
                <button className="w-12 h-12 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 border-b border-gray-50 text-xl">+</button>
                <button className="w-12 h-12 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 text-xl">-</button>
              </div>
          </div>
        </div>

        {/* Right Sidebar Store List Panel */}
        <div className="w-96 bg-white rounded-[48px] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter mb-1">매장 및 경쟁 현황</h4>
            <p className="text-[11px] text-gray-400 font-medium">상세 위치와 성과를 비교 분석하세요.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredStores.map((store) => (
              <div 
                key={store.id} 
                onClick={() => setSelectedStore(store.id)}
                className={`p-5 rounded-[28px] border transition-all cursor-pointer group flex items-start gap-4 ${
                  selectedStore === store.id 
                    ? 'bg-black border-black shadow-xl shadow-black/10' 
                    : 'bg-white border-transparent hover:border-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedStore === store.id ? 'bg-white/10 text-white' : store.type === 'internal' ? 'bg-purple-50 text-purple-600' : 'bg-rose-50 text-rose-500'
                }`}>
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                      selectedStore === store.id 
                        ? 'bg-white/20 text-white' 
                        : store.type === 'internal' ? 'bg-purple-100 text-purple-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {store.brand}
                    </span>
                    {store.type === 'internal' && (
                      <div className={`flex items-center gap-1 text-[10px] font-bold ${selectedStore === store.id ? 'text-emerald-400' : 'text-emerald-500'}`}>
                        <ArrowUpRight size={12} />
                        {store.sales}
                      </div>
                    )}
                  </div>
                  <h5 className={`text-sm font-bold truncate ${selectedStore === store.id ? 'text-white' : 'text-gray-900'}`}>{store.name}</h5>
                  <p className={`text-[10px] font-medium truncate mt-0.5 ${selectedStore === store.id ? 'text-white/50' : 'text-gray-400'}`}>{store.address}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-gray-50/50 border-t border-gray-50">
            <button className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-sm">
              상권 리포트 PDF 출력
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStrategy;
