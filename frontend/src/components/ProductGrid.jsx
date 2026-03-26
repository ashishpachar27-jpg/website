import { Link } from 'react-router-dom';
import { products } from '../data/mockData';

export default function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-8 font-display text-4xl">Featured Pieces</h2>
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <article key={item._id} className="group overflow-hidden rounded-2xl bg-charcoal">
            <div className="relative overflow-hidden">
              <img src={item.images[0]} alt={item.name} className="h-96 w-full object-cover transition duration-700 group-hover:scale-105" />
              <button className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-black opacity-0 transition group-hover:opacity-100">
                Add to Cart
              </button>
            </div>
            <div className="p-5">
              <Link to={`/product/${item._id}`} className="font-display text-xl hover:text-gold">{item.name}</Link>
              <p className="mt-2 text-white/80">${item.price}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
