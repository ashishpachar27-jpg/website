import { useState } from 'react';
import { products as initialProducts } from '../data/mockData';

export default function AdminDashboard() {
  const [products, setProducts] = useState(initialProducts);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({ name: '', price: '', description: '' });

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const submitForm = (event) => {
    event.preventDefault();
    setProducts((prev) => [
      {
        _id: crypto.randomUUID(),
        ...form,
        price: Number(form.price),
        images: [preview || 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=80'],
      },
      ...prev,
    ]);
    setForm({ name: '', price: '', description: '' });
    setPreview('');
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto grid max-w-7xl gap-6 p-6 md:grid-cols-[220px,1fr]">
        <aside className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-8 text-xl font-bold">Admin</h2>
          <nav className="space-y-3 text-sm">
            <p className="rounded-lg bg-slate-900 px-3 py-2 text-white">Dashboard</p>
            <p className="rounded-lg px-3 py-2 hover:bg-slate-100">Products</p>
            <p className="rounded-lg px-3 py-2 hover:bg-slate-100">Orders</p>
            <p className="rounded-lg px-3 py-2 hover:bg-slate-100">Settings</p>
          </nav>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Revenue', value: '$126,000' },
              { label: 'Orders', value: '1,942' },
              { label: 'Products', value: products.length },
            ].map((card) => (
              <article key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Product Table</h3>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-slate-100">
                      <td className="py-3">{product.name}</td>
                      <td className="py-3">${product.price}</td>
                      <td className="py-3">
                        <button className="mr-2 rounded bg-slate-200 px-3 py-1">Edit</button>
                        <button
                          className="rounded bg-red-100 px-3 py-1 text-red-700"
                          onClick={() => setProducts((prev) => prev.filter((item) => item._id !== product._id))}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <form onSubmit={submitForm} className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Add Product</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                required
                className="rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Product name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                required
                type="number"
                className="rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Price"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              />
              <textarea
                className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Description"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
              <input type="file" accept="image/*" onChange={handleUpload} className="md:col-span-2" />
              {preview && <img src={preview} alt="preview" className="h-40 w-40 rounded-lg object-cover" />}
            </div>
            <button className="mt-4 rounded-lg bg-slate-900 px-5 py-2 text-white">Add Product</button>
          </form>
        </section>
      </div>
    </main>
  );
}
