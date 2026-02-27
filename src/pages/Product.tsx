import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  type Seller = {
    _id?: string;
    name?: string;
    email?: string;
  } | null;

  type Product = {
    _id?: string;
    title?: string;
    title_i18n?: Record<string, string>;
    description?: string;
    description_i18n?: Record<string, string>;
    price?: number;
    category?: string;
    type?: 'sell' | 'rent';
    brand?: string;
    images?: string[];
    seller?: Seller;
    contact?: string;
    location?: string;
    createdAt?: string;
    [k: string]: unknown;
  } | null;

  const [product, setProduct] = useState<Product>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  // editable fields
  interface ProductEdit {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    brand?: string;
    location?: string;
    contact?: string;
    images?: string[];
    [k: string]: unknown;
  }
  const [editFields, setEditFields] = useState<ProductEdit>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // simple mobile detection: userAgent + coarse pointer media query
    try {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const uaMobile = /Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(ua);
      const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(pointer: coarse)') : null;
      const coarse = mq ? mq.matches : false;
      setIsMobile(uaMobile || coarse);
    } catch (e) {
      setIsMobile(false);
    }
  }, []);

  const SITE_PHONE = '+1234567890';

  const formatWhatsapp = (phone?: string) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    // ensure digits include country code; wa.me expects no plus
    return `https://wa.me/${digits}`;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return setError('Missing product id');
      try {
        console.debug('ProductPage: fetching', id);
  const api = await import('@/lib/api');
  const res = await api.apiFetch(`/api/products/${id}`);
        console.debug('ProductPage: response status', res.status);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Product not found');
            return;
          }
          let msg = `Load failed (${res.status})`;
          try {
            const body = await res.json();
            if (body && body.error) msg = body.error;
          } catch (e) {
            // ignore
          }
          setError(msg);
          return;
        }
        const data = await res.json();
        console.debug('ProductPage: data', data);
        if (!mounted) return;
        setProduct(data);
      } catch (err: unknown) {
        let msg = 'Network error';
        if (err && typeof err === 'object' && 'message' in err) {
          const em = (err as Record<string, unknown>)['message'];
          if (typeof em === 'string') msg = em;
        }
        setError(msg);
        toast({ title: 'Could not load product' });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, navigate, toast]);

  if (!product) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl p-6">
        {error ? (
          <div>
            <div className="rounded-md bg-destructive/10 border border-destructive p-4 text-destructive">{error}</div>
            <div className="mt-3">
              {isMobile && product?.contact && <a className="block text-sm text-primary" href={`tel:${product.contact}`}>Call {product.contact}</a>}
              {isMobile && product?.contact && <a className="block text-sm text-primary" href={`sms:${product.contact}?body=${encodeURIComponent('Hello, I am interested in your product.')}`}>Send SMS</a>}
                </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="mx-auto max-w-5xl p-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden border border-border">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.title} className="w-full h-80 object-cover" />
              ) : (
                <div className="w-full h-80 bg-muted-foreground/10 flex items-center justify-center">No image</div>
              )}
            </div>

            {!editMode ? (
              <>
                <h1 className="mt-4 text-2xl font-bold">{product.title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{product.category} • {product.location || 'Unknown'}</p>
                <p className="mt-4 text-base whitespace-pre-wrap">{product.description}</p>
              </>
            ) : (
              <div className="space-y-4">
                <input className="w-full rounded border border-input px-3 py-2" value={editFields.title || product.title || ''} onChange={(e) => setEditFields((s: ProductEdit) => ({ ...s, title: e.target.value }))} />
                <input className="w-full rounded border border-input px-3 py-2" value={editFields.category || product.category || ''} onChange={(e) => setEditFields((s: ProductEdit) => ({ ...s, category: e.target.value }))} />
                <textarea className="w-full rounded border border-input px-3 py-2 h-32" value={editFields.description || product.description || ''} onChange={(e) => setEditFields((s: ProductEdit) => ({ ...s, description: e.target.value }))} />
              </div>
            )}

            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {product.images.slice(1).map((src: string, idx: number) => (
                  <img key={idx} src={src} alt={`img-${idx}`} className="h-24 w-full object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-lg border border-border p-4 bg-card">
            <div className="text-3xl font-bold">₾{product.price}</div>
            <div className="mt-3 text-sm text-muted-foreground">Posted by</div>
            <div className="mt-1 font-medium">{product.seller?.name || product.seller?.email || 'Seller'}</div>
            <div className="mt-4">
              <a className="block text-sm text-primary" href={`mailto:${product.seller?.email || ''}`}>Contact seller</a>
              {product.contact && <div className="mt-2 text-sm">Phone: {product.contact}</div>}

              <div className="mt-3 flex flex-wrap gap-2">
                {/* Call seller (fallback to site) - only on mobile */}
                {isMobile && (
                  <a href={`tel:${product.contact || SITE_PHONE}`} className="inline-flex items-center rounded-md border px-3 py-2 text-sm">Call seller</a>
                )}

                {/* WhatsApp (opens web or app); only include if contact exists */}
                {product.contact && (
                  <a target="_blank" rel="noopener noreferrer" href={formatWhatsapp(product.contact) || undefined} className="inline-flex items-center rounded-md border px-3 py-2 text-sm">WhatsApp</a>
                )}

                {/* SMS - only on mobile */}
                {isMobile && (
                  <a href={`sms:${product.contact || SITE_PHONE}?body=${encodeURIComponent(`Hello, I'm interested in your listing: ${product.title || ''}`)}`} className="inline-flex items-center rounded-md border px-3 py-2 text-sm">Send SMS</a>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex gap-2">
                <button onClick={() => window.history.back()} className="flex-1 rounded-xl border border-border px-4 py-2">Back</button>
                {(() => {
                  try {
                    const raw = localStorage.getItem('user');
                    const usr = raw ? JSON.parse(raw) : null;
                    if (usr && usr.role === 'admin') {
                      return (
                        <div className="flex gap-2">
                          {!editMode ? (
                            <button onClick={() => { setEditFields({ title: product.title, description: product.description, category: product.category, price: product.price, brand: product.brand, location: product.location, contact: product.contact, images: product.images }); setEditMode(true); }} className="rounded-xl border border-border px-4 py-2">Edit</button>
                          ) : (
                            <>
                              <button disabled={saving} onClick={async () => {
                                setSaving(true);
                                try {
                                  const token = localStorage.getItem('token');
                                  const api = await import('@/lib/api');
                                  const res = await api.apiFetch(`/api/products/${product._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(editFields) });
                                  const body = await res.json();
                                  if (!res.ok) {
                                    alert(body.error || 'Update failed');
                                    setSaving(false);
                                    return;
                                  }
                                  setProduct(body);
                                  setEditMode(false);
                                  setSaving(false);
                                } catch (e) {
                                  alert('Network error');
                                  setSaving(false);
                                }
                              }} className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">{saving ? 'Saving...' : 'Save'}</button>
                              <button disabled={saving} onClick={() => { setEditMode(false); setEditFields({}); }} className="rounded-xl border border-border px-4 py-2">Cancel</button>
                            </>
                          )}
                          <button
                            disabled={deleting}
                            onClick={async () => {
                              if (!confirm('Delete this product?')) return;
                              setDeleting(true);
                              try {
                                const token = localStorage.getItem('token');
                                const api = await import('@/lib/api');
                                const res = await api.apiFetch(`/api/products/${product._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                if (!res.ok) {
                                  const body = await res.json().catch(() => ({}));
                                  alert(body.error || 'Delete failed');
                                  setDeleting(false);
                                  return;
                                }
                                // success
                                navigate('/listings');
                              } catch (e) {
                                alert('Network error');
                                setDeleting(false);
                              }
                            }}
                            className="rounded-xl bg-destructive px-4 py-2 text-sm text-destructive-foreground"
                          >
                            {deleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      );
                    }
                  } catch (e) {
                    // ignore
                  }
                  return null;
                })()}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
