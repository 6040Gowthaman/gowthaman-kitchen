import React, { useState, useMemo } from 'react';
import { 
  Search, Leaf, ShoppingBag, Plus, Minus, X, CheckCircle2, 
  Clock, ChevronRight, UtensilsCrossed, ArrowRight, QrCode, 
  Copy, Info, Printer, MessageCircle 
} from 'lucide-react';

const MENU_DATA = [
  { id: 1, name: "Chicken Samosa", category: "Snacks", type: "non-veg", price: 35, qty: "2 pcs", icon: "🥟" },
  { id: 2, name: "French Fries", category: "Snacks", type: "veg", price: 40, qty: "100g", icon: "🍟" },
  { id: 3, name: "Chicken Roll", category: "Snacks", type: "non-veg", price: 30, qty: "1 pc", icon: "🌯" },
  { id: 4, name: "Chicken Pakoda", category: "Snacks", type: "non-veg", price: 60, qty: "100g", icon: "🍗" },
  { id: 5, name: "Chicken Popcorn", category: "Snacks", type: "non-veg", price: 70, qty: "100g", icon: "🍿" },
  { id: 6, name: "Veg Momo", category: "Momos", type: "veg", price: 60, qty: "5 pcs", icon: "🥟" },
  { id: 7, name: "Chicken Momo", category: "Momos", type: "non-veg", price: 70, qty: "5 pcs", icon: "🥟" },
  { id: 8, name: "Paneer Momos", category: "Momos", type: "veg", price: 80, qty: "5 pcs", icon: "🧀" },
  { id: 9, name: "Mushroom Momos", category: "Momos", type: "veg", price: 80, qty: "5 pcs", icon: "🍄" }
];

// --- MERCHANT CONFIG ---
const MERCHANT_UPI_ID = "crgowtham77@oksbi"; 
const MERCHANT_NAME = "Gowthaman P";

// 🛑 UPDATE THIS: Your real WhatsApp number with 91 at the start
const MERCHANT_WHATSAPP = "917904310060"; 

// This is the link Vercel gave you
const STORE_URL = "[https://gowthaman-kitchen.vercel.app](https://gowthaman-kitchen.vercel.app)"; 

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [showStoreQR, setShowStoreQR] = useState(false);
  const [orderStatus, setOrderStatus] = useState('idle'); 
  const [copyStatus, setCopyStatus] = useState(false);

  const categories = ["All", ...new Set(MENU_DATA.map(item => item.category))];

  const filteredMenu = useMemo(() => {
    return MENU_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesVeg = !vegOnly || item.type === "veg";
      return matchesSearch && matchesCategory && matchesVeg;
    });
  }, [searchTerm, activeCategory, vegOnly]);

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: { ...item, count: (prev[item.id]?.count || 0) + 1 }
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id].count > 1) { newCart[id].count -= 1; } 
      else { delete newCart[id]; }
      return newCart;
    });
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.count), 0);
  const cartItemCount = cartItems.reduce((acc, curr) => acc + curr.count, 0);

  const handleConfirmPaid = () => {
    const orderDetails = cartItems.map(item => `${item.name} (${item.count}x)`).join(', ');
    const message = `*NEW ORDER FROM MENU*\n\nItems: ${orderDetails}\nTotal Amount: ₹${cartTotal}\n\nI have completed the payment via UPI. Please confirm my order!`;
    const whatsappLink = `https://wa.me/${MERCHANT_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    setOrderStatus('processing');
    setTimeout(() => { setOrderStatus('success'); setCart({}); }, 1200);
  };

  const copyUpiId = () => {
    const el = document.createElement('textarea');
    el.value = MERCHANT_UPI_ID;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const upiLink = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal}&cu=INR`;
  const paymentQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;
  const storeQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(STORE_URL)}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-32 text-slate-900 select-none">
      <header className="bg-emerald-950 text-white rounded-b-[2.5rem] shadow-2xl sticky top-0 z-40">
        <div className="max-w-md mx-auto px-6 pt-12 pb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-500/30"><UtensilsCrossed className="w-6 h-6 text-emerald-400" /></div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none uppercase">Gowthaman's Kitchen</h1>
                <p className="text-[9px] uppercase font-bold text-emerald-400/80 tracking-[0.2em] mt-1.5">Elite Snacks • Scan & Order</p>
              </div>
            </div>
            <button onClick={() => setShowStoreQR(true)} className="bg-emerald-900 p-2.5 rounded-xl border border-emerald-800 text-emerald-400 active:scale-95 transition-all flex flex-col items-center gap-1">
              <QrCode className="w-5 h-5" /><span className="text-[8px] font-black tracking-tighter">GET QR</span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <input type="text" placeholder="Search snacks..." className="w-full bg-emerald-900/40 border border-emerald-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none text-sm placeholder:text-emerald-700 focus:border-emerald-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeCategory === cat ? "bg-white text-emerald-950 shadow-lg" : "bg-emerald-900/50 text-emerald-200 border border-emerald-800"}`}>{cat}</button>
                ))}
              </div>
              <button onClick={() => setVegOnly(!vegOnly)} className={`p-2.5 rounded-xl border transition-all ${vegOnly ? "bg-emerald-500 border-emerald-400 text-white" : "bg-emerald-900/50 border-emerald-800 text-emerald-500"}`}><Leaf className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-10">
        {filteredMenu.length > 0 ? categories.filter(c => c !== "All").map(category => {
          const items = filteredMenu.filter(i => i.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">{category}</h2>
              <div className="grid gap-4">
                {items.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center active:scale-[0.98] transition-transform">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100 relative">
                        {item.icon}<div className={`absolute -top-1 -left-1 w-3.5 h-3.5 border-2 rounded-sm bg-white flex items-center justify-center ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}><div className={`w-1 h-1 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div></div>
                      </div>
                      <div><h3 className="font-bold text-slate-800 text-sm">{item.name}</h3><p className="text-emerald-600 font-black text-xs mt-0.5">₹{item.price}</p></div>
                    </div>
                    {cart[item.id] ? (
                      <div className="flex items-center bg-emerald-950 text-white rounded-xl overflow-hidden shadow-md">
                        <button onClick={() => removeFromCart(item.id)} className="p-2"><Minus className="w-3 h-3" /></button>
                        <span className="w-5 text-center text-xs font-black">{cart[item.id].count}</span>
                        <button onClick={() => addToCart(item)} className="p-2"><Plus className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(item)} className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Plus className="w-5 h-5" /></button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }) : <div className="py-20 text-center text-slate-400 font-bold">No items found.</div>}
      </main>

      {cartItemCount > 0 && !showCheckout && (
        <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto z-40">
          <button onClick={() => setShowCheckout(true)} className="w-full bg-emerald-950 text-white rounded-[2rem] p-4 shadow-2xl flex items-center justify-between group active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-900 p-3 rounded-2xl relative"><ShoppingBag className="w-6 h-6 text-emerald-300" /><span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black px-1.5 rounded-full border-2 border-emerald-950">{cartItemCount}</span></div>
              <p className="text-xl font-black tracking-tight">₹{cartTotal}</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Review <ArrowRight className="w-4 h-4" /></div>
          </button>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowCheckout(false)}></div>
          <div className="relative bg-white w-full max-w-md mx-auto rounded-t-[3rem] shadow-2xl animate-in slide-in-from-bottom-full duration-500 overflow-hidden">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto my-4"></div>
            {orderStatus === 'success' ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-6 animate-bounce"><CheckCircle2 className="w-10 h-10" /></div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Order Sent!</h3>
                <p className="text-slate-500 mt-4 text-sm leading-relaxed px-6">Check your WhatsApp to see your order summary. Gowthaman will start preparing it now!</p>
                <button onClick={() => { setShowCheckout(false); setOrderStatus('idle'); }} className="w-full mt-10 bg-emerald-950 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest">Back to Menu</button>
              </div>
            ) : orderStatus === 'payment' ? (
              <div className="p-8 space-y-6">
                <div className="text-center"><h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{cartTotal}</h3><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Paying Gowthaman P</p></div>
                <div className="bg-white rounded-[2rem] border-2 border-slate-50 p-6 flex flex-col items-center shadow-inner">
                  <img src={paymentQrUrl} alt="Payment QR" className="w-48 h-48 mb-4 rounded-xl border-4 border-white" />
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl w-full border border-slate-100 overflow-hidden">
                    <span className="text-[10px] font-black text-slate-400 uppercase shrink-0">UPI ID</span><span className="text-[11px] font-bold text-slate-800 truncate flex-grow text-center">{MERCHANT_UPI_ID}</span>
                    <button onClick={copyUpiId} className="p-2 text-emerald-600">{copyStatus ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                  </div>
                </div>
                <button onClick={handleConfirmPaid} className="w-full bg-emerald-950 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">I've Paid ₹{cartTotal} <MessageCircle className="w-5 h-5 text-emerald-400" /></button>
              </div>
            ) : (
              <div className="flex flex-col p-8">
                <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black text-slate-900 tracking-tighter">Review Order</h3><button onClick={() => setShowCheckout(false)} className="p-2 bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button></div>
                <div className="space-y-4 mb-8 overflow-y-auto max-h-[40vh]">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-50"><div className="flex items-center gap-3"><span className="text-xs font-black text-slate-400 w-5">x{item.count}</span><span className="font-bold text-slate-800 text-sm">{item.name}</span></div><span className="font-black text-slate-900 text-sm">₹{item.price * item.count}</span></div>
                  ))}
                  <div className="pt-4 flex justify-between items-center font-black text-xl"><span>Total</span><span className="text-emerald-700">₹{cartTotal}</span></div>
                </div>
                <button onClick={() => setOrderStatus('payment')} className="w-full bg-emerald-950 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">Pay Now <ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {showStoreQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowStoreQR(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-8 text-center space-y-6 shadow-2xl">
            <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 mb-2"><QrCode className="w-8 h-8" /></div>
            <div><h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Your Table QR Code</h3><p className="text-slate-400 text-[10px] font-bold uppercase mt-3 leading-relaxed px-4">Print this for your tables. Scanning it opens your menu!</p></div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 inline-block shadow-inner"><img src={storeQrUrl} alt="Store QR" className="w-48 h-48 rounded-xl border-4 border-white" /></div>
            <div className="flex flex-col gap-2">
              <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print QR</button>
              <button onClick={() => setShowStoreQR(false)} className="w-full bg-slate-100 text-slate-400 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
