import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

const inputClass = 'w-full rounded-xl border border-input bg-background py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring';

const AddProduct: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [title_en, setTitleEn] = useState('');
  const [title_ka, setTitleKa] = useState('');
  const [description_en, setDescriptionEn] = useState('');
  const [description_ka, setDescriptionKa] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('General');
  const [listingType, setListingType] = useState<'sell'|'rent'>('sell');
  const [location, setLocation] = useState('');
  const [brand, setBrand] = useState('');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // client-side guard: only admins should stay on this page
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const usr = raw ? JSON.parse(raw) : null;
      if (!usr || usr.role !== 'admin') {
        navigate('/');
      }
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return toast({ title: 'Enter an image URL' });
    setImages((s) => [url, ...s]);
    setImageUrl('');
  };

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string | null;
        if (result) setImages((s) => [result, ...s]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => setImages((s) => s.filter((_, i) => i !== idx));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    // require at least one title and one description (en or ka)
    if (!((title_en || '').trim() || (title_ka || '').trim() || (title || '').trim())) nextErrors.title = 'Please provide a title (en or ka)';
    if (!((description_en || '').trim() || (description_ka || '').trim() || (description || '').trim())) nextErrors.description = 'Please provide a description (en or ka)';
    if (!price.trim() || isNaN(Number(price))) nextErrors.price = 'Enter a valid price';
    if (!contact.trim()) nextErrors.contact = 'Contact is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return toast({ title: 'Please fix the highlighted fields' });
    }
    const token = localStorage.getItem('token');
    if (!token) return toast({ title: 'Not authorized' });

    const titleFallback = title_en || title_ka || title;
    const descFallback = description_en || description_ka || description;
    const body = {
      title: titleFallback.trim(),
      description: descFallback.trim(),
      title_i18n: {
        en: (title_en || '').trim(),
        ka: (title_ka || '').trim(),
      },
      description_i18n: {
        en: (description_en || '').trim(),
        ka: (description_ka || '').trim(),
      },
      price: Number(price) || 0,
      category,
      location: location.trim(),
      type: listingType,
      brand: brand.trim(),
      contact,
      images,
    };

    try {
      const api = await import('@/lib/api');
      const res = await api.apiFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return toast({ title: data.error || 'Add product failed' });
      toast({ title: 'Product added' });
      navigate('/listings');
    } catch (err) {
      toast({ title: 'Network error' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold mb-4">Add Product</h1>

        <form onSubmit={submit} className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-2">Title (English)</label>
            <input className={`${inputClass} ${errors.title ? 'border-destructive' : ''}`} value={title_en} onChange={(e) => { setTitleEn(e.target.value); setErrors((s) => ({ ...s, title: undefined })); }} placeholder="Product title (en)" />
            {errors.title && <div className="mt-1 text-xs text-destructive">{errors.title}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title (Georgian)</label>
            <input className={`${inputClass} ${errors.title ? 'border-destructive' : ''}`} value={title_ka} onChange={(e) => { setTitleKa(e.target.value); setErrors((s) => ({ ...s, title: undefined })); }} placeholder="Product title (ka)" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (English)</label>
            <textarea className={`${inputClass} h-24 resize-y ${errors.description ? 'border-destructive' : ''}`} value={description_en} onChange={(e) => { setDescriptionEn(e.target.value); setErrors((s) => ({ ...s, description: undefined })); }} placeholder="Short description (en)" />
            {errors.description && <div className="mt-1 text-xs text-destructive">{errors.description}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Georgian)</label>
            <textarea className={`${inputClass} h-24 resize-y ${errors.description ? 'border-destructive' : ''}`} value={description_ka} onChange={(e) => { setDescriptionKa(e.target.value); setErrors((s) => ({ ...s, description: undefined })); }} placeholder="Short description (ka)" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium mb-2">Price (GEL)</label>
                <input className={`${inputClass} ${errors.price ? 'border-destructive' : ''}`} value={price} onChange={(e) => { setPrice(e.target.value); setErrors((s) => ({ ...s, price: undefined })); }} placeholder="e.g. 1200" />
                {errors.price && <div className="mt-1 text-xs text-destructive">{errors.price}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="General">General</option>
                <option value="Electronics">{t('electronicsCategory') || 'Electronics'}</option>
                <option value="Real Estate">{t('realEstateCategory') || 'Real Estate'}</option>
                <option value="Vehicles">{t('vehiclesCategory') || 'Vehicles'}</option>
                <option value="Jewelry">{t('jewelryCategory') || 'Jewelry'}</option>
                <option value="Fashion">{t('fashionCategory') || 'Fashion'}</option>
                <option value="Collectibles">{t('collectiblesCategory') || 'Collectibles'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Listing type</label>
              <select className={inputClass} value={listingType} onChange={(e) => setListingType(e.target.value as 'sell'|'rent')}>
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Region" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input className={inputClass} value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Manufacturer or brand" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact number</label>
            <input className={`${inputClass} ${errors.contact ? 'border-destructive' : ''}`} value={contact} onChange={(e) => { setContact(e.target.value); setErrors((s) => ({ ...s, contact: undefined })); }} placeholder="Phone or WhatsApp" />
            {errors.contact && <div className="mt-1 text-xs text-destructive">{errors.contact}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images (URL or upload)</label>
            <div className="flex gap-2">
              <input className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" />
              <button type="button" onClick={addImageUrl} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Add</button>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} className="hidden" />
              <button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl border border-border px-4 py-2 text-sm">Upload files</button>
              <span className="text-sm text-muted-foreground">or drag & drop not supported — use upload or paste URL</span>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((src, idx) => (
                  <div key={idx} className="relative rounded overflow-hidden border border-border">
                    <img src={src} alt={`preview-${idx}`} className="h-28 w-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 rounded-full bg-red-600 text-white px-2 py-1 text-xs">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
