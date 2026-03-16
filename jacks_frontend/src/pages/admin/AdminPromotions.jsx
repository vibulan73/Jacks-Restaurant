import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { promotionAPI } from '../../services/api';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import { FaSun, FaStar } from 'react-icons/fa';

const FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=120&fit=crop';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm();

  const load = () => promotionAPI.getAll().then(r => setPromotions(r.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); reset(); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    ['title','description','imageUrl','discount'].forEach(f => setValue(f, p[f]));
    setValue('startDate', p.startDate);
    setValue('endDate', p.endDate);
    setValue('active', p.active);
    setValue('promotionType', p.promotionType || 'SPECIAL');
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) { await promotionAPI.update(editing.id, data); toast.success('Promotion updated!'); }
      else { await promotionAPI.create(data); toast.success('Promotion created!'); }
      setShowModal(false); reset(); load();
    } catch { toast.error('Failed to save promotion'); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try { await promotionAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const inputCls = 'w-full bg-gray-800 border border-white/20 text-white placeholder-white/40 px-3 py-2 rounded-lg focus:outline-none focus:border-pub-gold text-sm';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-white font-display text-3xl font-bold">Promotions</h1>
          <p className="text-white/40 text-sm mt-1">{promotions.length} promotions</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><HiPlus size={18} /> New Promotion</button>
      </div>

      {loading ? <div className="text-white/50 text-center py-10">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {promotions.map(p => (
            <div key={p.id} className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
              <div className="h-36 relative overflow-hidden">
                <img src={p.imageUrl || FALLBACK} alt={p.title} onError={e => { e.target.src = FALLBACK; }} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute top-3 left-3 bg-pub-gold text-pub-dark text-xs font-bold px-2 py-1 rounded">{p.discount}</div>
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    p.promotionType === 'DAILY' ? 'bg-blue-500/90 text-white' : 'bg-purple-500/90 text-white'
                  }`}>
                    {p.promotionType === 'DAILY' ? <FaSun size={9} /> : <FaStar size={9} />}
                    {p.promotionType === 'DAILY' ? 'Daily' : 'Special'}
                  </span>
                </div>
                <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${p.active ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                  {p.active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold font-display mb-1">{p.title}</h3>
                <p className="text-white/50 text-xs line-clamp-2 mb-3">{p.description}</p>
                {p.endDate && <p className="text-white/30 text-xs mb-3">Ends: {p.endDate}</p>}
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg py-1.5 text-sm flex items-center justify-center gap-1.5"><HiPencil size={14} /> Edit</button>
                  <button onClick={() => handleDelete(p.id, p.title)} className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 rounded-lg py-1.5 text-sm flex items-center justify-center gap-1.5"><HiTrash size={14} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && promotions.length === 0 && <div className="text-center text-white/40 py-20">No promotions yet. Create one!</div>}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-white text-xl font-bold">{editing ? 'Edit Promotion' : 'New Promotion'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white"><HiX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Title *</label>
                <input {...register('title', { required: true })} className={inputCls} /></div>
              <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Description</label>
                <textarea {...register('description')} rows={3} className={inputCls + ' resize-none'} /></div>
              <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Promotion Type *</label>
                <select {...register('promotionType', { required: true })} className={inputCls}>
                  <option value="DAILY">Daily Promotion</option>
                  <option value="SPECIAL">Special Promotion</option>
                </select>
              </div>
              <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Discount Text</label>
                <input {...register('discount')} placeholder="e.g. 50% OFF" className={inputCls} /></div>
              <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Image URL</label>
                <input {...register('imageUrl')} placeholder="https://..." className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Start Date</label>
                  <input type="date" {...register('startDate')} className={inputCls} /></div>
                <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">End Date</label>
                  <input type="date" {...register('endDate')} className={inputCls} /></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('active')} className="w-4 h-4 accent-pub-gold" />
                <span className="text-white/70 text-sm">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-white/20 text-white/70 py-2.5 rounded-lg hover:bg-white/5 text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary disabled:opacity-50 text-sm">{isSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
