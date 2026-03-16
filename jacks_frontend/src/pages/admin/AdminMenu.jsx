import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { menuAPI } from '../../services/api';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import { FaFire, FaLeaf, FaStar } from 'react-icons/fa';

const FALLBACK = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop';

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

  const load = () => {
    Promise.all([menuAPI.getAll().then(r => setItems(r.data)), menuAPI.getCategories().then(r => setCategories(r.data))])
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); reset(); setShowModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setValue('name', item.name);
    setValue('description', item.description);
    setValue('price', item.price);
    setValue('imageUrl', item.imageUrl);
    setValue('categoryId', item.categoryId);
    setValue('isPopular', item.isPopular);
    setValue('isSpicy', item.isSpicy);
    setValue('isVegan', item.isVegan);
    setValue('isActive', item.isActive);
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, price: parseFloat(data.price), categoryId: parseInt(data.categoryId) };
      if (editing) {
        await menuAPI.update(editing.id, payload);
        toast.success('Menu item updated!');
      } else {
        await menuAPI.create(payload);
        toast.success('Menu item added!');
      }
      setShowModal(false); reset(); load();
    } catch { toast.error('Failed to save item'); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await menuAPI.delete(id); toast.success('Item deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = filterCat === 'all' ? items : items.filter(i => i.categoryId === parseInt(filterCat));
  const inputCls = 'w-full bg-gray-800 border border-white/20 text-white placeholder-white/40 px-3 py-2 rounded-lg focus:outline-none focus:border-pub-gold text-sm';

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-white font-display text-3xl font-bold">Menu Management</h1>
          <p className="text-white/40 text-sm mt-1">{items.length} items across {categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><HiPlus size={18} /> Add Item</button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterCat('all')} className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${filterCat === 'all' ? 'bg-pub-gold text-pub-dark' : 'bg-gray-800 text-white/60 hover:bg-gray-700'}`}>All</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setFilterCat(String(c.id))} className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${filterCat === String(c.id) ? 'bg-pub-gold text-pub-dark' : 'bg-gray-800 text-white/60 hover:bg-gray-700'}`}>{c.name}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? <div className="text-white/50 text-center py-10">Loading...</div> : (
        <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/60 border-b border-white/10">
              <tr>
                <th className="text-left text-white/50 uppercase tracking-wider px-4 py-3 text-xs w-16">Image</th>
                <th className="text-left text-white/50 uppercase tracking-wider px-4 py-3 text-xs">Name</th>
                <th className="text-left text-white/50 uppercase tracking-wider px-4 py-3 text-xs hidden md:table-cell">Category</th>
                <th className="text-left text-white/50 uppercase tracking-wider px-4 py-3 text-xs">Price</th>
                <th className="text-left text-white/50 uppercase tracking-wider px-4 py-3 text-xs hidden sm:table-cell">Tags</th>
                <th className="text-left text-white/50 uppercase tracking-wider px-4 py-3 text-xs">Status</th>
                <th className="text-left text-white/50 uppercase tracking-wider px-4 py-3 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <img src={item.imageUrl || FALLBACK} alt={item.name} onError={e => { e.target.src = FALLBACK; }}
                      className="w-12 h-10 object-cover rounded-lg" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-white/40 text-xs truncate max-w-xs">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-pub-gold text-xs">{item.categoryName}</span>
                  </td>
                  <td className="px-4 py-3 text-white font-semibold">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex gap-1">
                      {item.isPopular && <span className="bg-pub-gold/20 text-pub-gold text-xs px-1.5 py-0.5 rounded"><FaStar size={8} className="inline mr-0.5" />Pop</span>}
                      {item.isSpicy && <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded"><FaFire size={8} className="inline mr-0.5" />Spicy</span>}
                      {item.isVegan && <span className="bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 rounded"><FaLeaf size={8} className="inline mr-0.5" />Vegan</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {item.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-blue-400 hover:text-blue-300 p-1.5 rounded hover:bg-blue-500/10 transition-colors"><HiPencil size={16} /></button>
                      <button onClick={() => handleDelete(item.id, item.name)} className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-500/10 transition-colors"><HiTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center text-white/40 py-10">No items found</div>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-white text-xl font-bold">{editing ? 'Edit Item' : 'Add Menu Item'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white"><HiX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Name *</label>
                <input {...register('name', { required: true })} className={inputCls} />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Description</label>
                <textarea {...register('description')} rows={3} className={inputCls + ' resize-none'} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Price *</label>
                  <input {...register('price', { required: true })} type="number" step="0.01" className={inputCls} />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Category *</label>
                  <select {...register('categoryId', { required: true })} className={inputCls}>
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Image URL</label>
                <input {...register('imageUrl')} placeholder="https://..." className={inputCls} />
              </div>
              <div className="flex flex-wrap gap-4">
                {[['isPopular', 'Popular'], ['isSpicy', 'Spicy'], ['isVegan', 'Vegan'], ['isActive', 'Active']].map(([field, label]) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(field)} className="w-4 h-4 accent-pub-gold" />
                    <span className="text-white/70 text-sm">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-white/20 text-white/70 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary disabled:opacity-50 text-sm">{isSubmitting ? 'Saving...' : 'Save Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
