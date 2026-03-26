import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '../data/mockData';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useMemo(() => products.find((item) => item._id === id) || products[0], [id]);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <section className="grid gap-8 lg:grid-cols-[120px,1fr,1fr]">
        <div className="flex gap-3 overflow-auto lg:flex-col">
          {product.images.map((image) => (
            <button key={image} onClick={() => setActiveImage(image)} className={`h-24 w-24 overflow-hidden rounded-xl border ${activeImage === image ? 'border-gold' : 'border-white/20'}`}>
              <img src={image} alt="thumbnail" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <motion.div whileHover={{ scale: 1.03 }} className="overflow-hidden rounded-2xl">
          <img src={activeImage} alt={product.name} className="h-[620px] w-full object-cover" />
        </motion.div>

        <div>
          <h1 className="font-display text-4xl">{product.name}</h1>
          <p className="mt-3 text-2xl text-gold">${product.price}</p>
          <p className="mt-4 text-white/75">{product.description}</p>

          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-[0.2em]">Color</p>
            <div className="flex gap-3">
              {product.colors.map((option) => (
                <button
                  key={option}
                  onClick={() => setColor(option)}
                  className={`h-8 w-8 rounded-full border-2 ${color === option ? 'border-gold' : 'border-white/20'}`}
                  style={{ backgroundColor: option }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-[0.2em]">Size</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  onClick={() => setSize(option)}
                  className={`min-w-12 rounded-md border px-4 py-2 ${size === option ? 'border-gold text-gold' : 'border-white/20'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button className="mt-10 w-full rounded-full bg-white py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gold">
            Add to Cart
          </button>
        </div>
      </section>

      <section className="mt-20 grid gap-10 md:grid-cols-2 md:items-center">
        <h2 className="font-display text-4xl">The Story Behind the Craft</h2>
        <p className="text-white/75">Each look is constructed over hundreds of hours using beadwork, fine dyeing, and handloom fabrics curated from artisan clusters across Rajasthan, Banaras, and Kutch.</p>
      </section>

      <section className="mt-16">
        <h3 className="mb-6 font-display text-3xl">Complete the Look</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {products.map((item) => (
            <article key={item._id} className="min-w-[240px] overflow-hidden rounded-xl bg-charcoal">
              <img src={item.images[0]} alt={item.name} className="h-64 w-full object-cover" />
              <div className="p-4">
                <p className="font-display">{item.name}</p>
                <p className="text-white/70">${item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
