import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { galleryAPI } from '../../services/api';
import { HiPlus, HiTrash, HiX } from 'react-icons/hi';

const CATEGORIES = ['food', 'drinks', 'events', 'interior'];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: { category: 'food' } });

  const load = () => galleryAPI.getAll().then(r => setImages(r.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      await galleryAPI.create(data);
      toast.success('Image added!');
      setShowModal(false); reset(); load();
    } catch { toast.error('Failed to add image'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this image?')) return;
    try { await galleryAPI.delete(id); toast.success('Removed'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = filterCat === 'all' ? images : images.filter(i => i.category === filterCat);
  const inputCls = 'w-full bg-gray-800 border border-white/20 text-white placeholder-white/40 px-3 py-2 rounded-lg focus:outline-none focus:border-pub-gold text-sm';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-white font-display text-3xl font-bold">Gallery</h1>
          <p className="text-white/40 text-sm mt-1">{images.length} images</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><HiPlus size={18} /> Add Image</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${filterCat === cat ? 'bg-pub-gold text-pub-dark' : 'bg-gray-800 text-white/60 hover:bg-gray-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? <div className="text-white/50 text-center py-10">Loading...</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(img => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden bg-gray-900 aspect-square">
              <img src={img.imageUrl} alt={img.caption || 'Gallery'} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-pub-dark/0 group-hover:bg-pub-dark/70 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <span className="text-white text-xs text-center px-2">{img.caption}</span>
                <span className="text-pub-gold text-xs uppercase">{img.category}</span>
                <button onClick={() => handleDelete(img.id)} className="bg-red-500 text-white rounded-full p-2 hover:bg-red-400 transition-colors mt-1">
                  <HiTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-white text-xl font-bold">Add Image</h2>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white"><HiX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Image URL *</label>
                <input {...register('imageUrl', { required: true })} placeholder="https://..." className={inputCls} /></div>
              <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Category</label>
                <select {...register('category')} className={inputCls}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Caption</label>
                <input {...register('caption')} placeholder="Optional caption" className={inputCls} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-white/20 text-white/70 py-2.5 rounded-lg hover:bg-white/5 text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary disabled:opacity-50 text-sm">{isSubmitting ? 'Adding...' : 'Add Image'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
