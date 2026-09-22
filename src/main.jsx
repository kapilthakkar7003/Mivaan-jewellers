import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import "./styles.css";

const WHATSAPP = "917600661234";
const CONTACT = "+917600661234";

const localProducts = [
  { id:"local-1", name:"Mangalsutra Design 01", description:"A graceful gold-toned mangalsutra with traditional detailing and a refined pendant.", price:"", images:["/assets/products/design-01.jpg"], is_new:true, is_featured:true, is_published:true },
  { id:"local-2", name:"Mangalsutra Design 02", description:"An elegant black-bead mangalsutra with delicate diamond-style accents.", price:"", images:["/assets/products/design-02.jpg"], is_new:true, is_featured:false, is_published:true },
  { id:"local-3", name:"Mangalsutra Design 03", description:"A pearl-inspired mangalsutra finished with a graceful floral pendant.", price:"", images:["/assets/products/design-03.jpg"], is_new:true, is_featured:false, is_published:true },
  { id:"local-4", name:"Mangalsutra Design 04", description:"A traditional-inspired black-bead design with an ornate central pendant.", price:"", images:["/assets/products/design-04.jpg"], is_new:false, is_featured:true, is_published:true },
  { id:"local-5", name:"Mangalsutra Design 05", description:"A refined contemporary mangalsutra with a compact embellished pendant.", price:"", images:["/assets/products/design-05.jpg"], is_new:false, is_featured:false, is_published:true }
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

function whatsappUrl(product) {
  const text = `Hello Mivaan Jewellers, I am interested in ${product?.name || "your Mangalsutra collection"}. Please share more details.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function Logo() {
  return <img className="brand-logo" src="/assets/logo.jpg" alt="Mivaan Jewellers" />;
}

function Header({ onAdmin }) {
  const [open, setOpen] = useState(false);
  const nav = (id) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };
  return (
    <header className="site-header">
      <a className="header-brand" href="#" onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0,behavior:"smooth"});}}>
        <Logo />
      </a>
      <button className="menu-button" onClick={()=>setOpen(v=>!v)} aria-label="Open navigation"><span></span><span></span></button>
      <nav className={open ? "nav open" : "nav"}>
        <button onClick={()=>nav("home")}>Home</button>
        <button onClick={()=>nav("collection")}>Collection</button>
        <button onClick={()=>nav("story")}>Our Story</button>
        <button onClick={()=>nav("contact")}>Contact</button>
        <a className="nav-whatsapp" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp</a>
      </nav>
      <button className="admin-link" onClick={onAdmin}>Owner Login</button>
    </header>
  );
}

function ProductCard({ product, onOpen }) {
  return (
    <article className="product-card" onClick={()=>onOpen(product)}>
      <div className="product-image-wrap">
        {product.images?.[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" /> : <div className="image-placeholder">MIVAAN</div>}
        {product.is_new && <span className="pill">NEW</span>}
        <span className="view-overlay">View Details</span>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        {product.price ? <p className="price">{product.price}</p> : <p className="enquire">Enquire for details</p>}
      </div>
    </article>
  );
}

function ProductModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={e=>e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <div className="modal-gallery">
          {(product.images || []).map((src,i)=><img key={i} src={src} alt={`${product.name} ${i+1}`} />)}
        </div>
        <div className="modal-copy">
          <div className="eyebrow">MIVAAN JEWELLERS</div>
          <h2>{product.name}</h2>
          <p>{product.description || "A thoughtfully presented Mangalsutra from the Mivaan Jewellers collection."}</p>
          {product.price && <div className="modal-price">{product.price}</div>}
          <div className="modal-actions">
            <a className="button gold" href={whatsappUrl(product)} target="_blank" rel="noreferrer">WhatsApp Enquiry</a>
            <a className="button outline" href={`tel:${CONTACT}`}>Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Admin({ onBack }) {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(()=>{
    if (!supabase) return;
    supabase.auth.getSession().then(({data})=>setSession(data.session));
    const {data:listener} = supabase.auth.onAuthStateChange((_event, s)=>setSession(s));
    return ()=>listener.subscription.unsubscribe();
  },[]);

  async function load() {
    if (!supabase || !session) return;
    const {data,error} = await supabase.from("products").select("*").order("sort_order").order("created_at",{ascending:false});
    if (error) setMessage(error.message); else setProducts(data || []);
  }
  useEffect(()=>{load()},[session]);

  if (!supabase) return (
    <div className="admin-shell">
      <div className="admin-top"><Logo/><button onClick={onBack}>Back to site</button></div>
      <div className="setup-card">
        <span className="eyebrow">ADMIN SETUP</span>
        <h1>Connect Supabase to activate the Owner Panel.</h1>
        <p>The included README and <code>supabase.sql</code> file contain the exact setup. Until then, the public website works with the five supplied demo products.</p>
      </div>
    </div>
  );

  async function login(e) {
    e.preventDefault(); setBusy(true); setMessage("");
    const {error} = await supabase.auth.signInWithPassword({email,password});
    setBusy(false); if (error) setMessage(error.message);
  }
  async function logout(){ await supabase.auth.signOut(); setEditing(null); }

  async function saveProduct(e) {
    e.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(e.currentTarget);
    const record = {
      name: form.get("name"),
      description: form.get("description") || "",
      price: form.get("price") || "",
      is_new: form.get("is_new") === "on",
      is_featured: form.get("is_featured") === "on",
      is_published: form.get("is_published") === "on",
      sort_order: Number(form.get("sort_order") || 0)
    };
    try {
      let images = editing?.images || [];
      const files = [...e.currentTarget.querySelector('input[type="file"]').files];
      for (const file of files) {
        const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
        const {error:upErr} = await supabase.storage.from("product-images").upload(path,file,{upsert:false});
        if (upErr) throw upErr;
        const {data:urlData} = supabase.storage.from("product-images").getPublicUrl(path);
        images.push(urlData.publicUrl);
      }
      record.images = images;
      let result;
      if (editing) result = await supabase.from("products").update(record).eq("id",editing.id);
      else result = await supabase.from("products").insert(record);
      if (result.error) throw result.error;
      setMessage(editing ? "Product updated." : "Product published.");
      setEditing(null); e.currentTarget.reset(); await load();
    } catch(err) { setMessage(err.message || "Something went wrong."); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (!confirm("Delete this product?")) return;
    const {error} = await supabase.from("products").delete().eq("id",id);
    if (error) setMessage(error.message); else load();
  }

  if (!session) return (
    <div className="admin-shell">
      <div className="admin-top"><Logo/><button onClick={onBack}>Back to site</button></div>
      <form className="login-card" onSubmit={login}>
        <span className="eyebrow">OWNER ACCESS</span>
        <h1>Mivaan Admin</h1>
        <p>Private product management.</p>
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button className="button gold full" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>
        {message && <div className="notice">{message}</div>}
      </form>
    </div>
  );

  return (
    <div className="admin-shell">
      <div className="admin-top">
        <Logo/>
        <div className="admin-actions"><button onClick={onBack}>View Website</button><button onClick={logout}>Sign Out</button></div>
      </div>
      <main className="admin-main">
        <div className="admin-heading">
          <div><span className="eyebrow">OWNER DASHBOARD</span><h1>Manage Mangalsutras</h1></div>
          <button className="button gold" onClick={()=>setEditing({images:[]})}>+ Add New Design</button>
        </div>
        {message && <div className="notice">{message}</div>}
        {editing && (
          <form className="editor-card" onSubmit={saveProduct}>
            <div className="editor-head"><h2>{editing.id ? "Edit Design" : "Add New Design"}</h2><button type="button" onClick={()=>setEditing(null)}>Cancel</button></div>
            <div className="form-grid">
              <label>Product name<input name="name" defaultValue={editing.name || ""} required /></label>
              <label>Price (optional)<input name="price" defaultValue={editing.price || ""} placeholder="e.g. ₹ 25,000" /></label>
              <label className="wide">Description<textarea name="description" defaultValue={editing.description || ""} rows="4" /></label>
              <label>Display order<input name="sort_order" type="number" defaultValue={editing.sort_order || 0} /></label>
              <label className="wide">Add product photos<input name="files" type="file" accept="image/*" multiple /></label>
            </div>
            <div className="checks">
              <label><input name="is_new" type="checkbox" defaultChecked={editing.id ? editing.is_new : true}/> New</label>
              <label><input name="is_featured" type="checkbox" defaultChecked={editing.is_featured}/> Featured</label>
              <label><input name="is_published" type="checkbox" defaultChecked={editing.id ? editing.is_published : true}/> Published</label>
            </div>
            <button className="button gold" disabled={busy}>{busy ? "Saving…" : "Save & Publish"}</button>
          </form>
        )}
        <div className="admin-list">
          {products.map(p=>(
            <div className="admin-product" key={p.id}>
              <img src={p.images?.[0]} alt="" />
              <div><strong>{p.name}</strong><span>{p.is_published ? "Published" : "Hidden"} · {p.is_featured ? "Featured" : "Standard"}</span></div>
              <button onClick={()=>setEditing(p)}>Edit</button>
              <button className="danger" onClick={()=>remove(p.id)}>Delete</button>
            </div>
          ))}
          {!products.length && <div className="empty">No live products yet. Add your first Mangalsutra design.</div>}
        </div>
      </main>
    </div>
  );
}

function Site({ onAdmin }) {
  const [products,setProducts] = useState(localProducts);
  const [selected,setSelected] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    if (!supabase) return;
    setLoading(true);
    supabase.from("products").select("*").eq("is_published",true).order("sort_order").order("created_at",{ascending:false})
      .then(({data,error})=>{ if(!error && data?.length) setProducts(data); })
      .finally(()=>setLoading(false));
  },[]);

  const featured = useMemo(()=>products.filter(p=>p.is_featured),[products]);

  return (
    <>
      <Header onAdmin={onAdmin}/>
      <main>
        <section id="home" className="hero">
          <div className="hero-copy">
            <span className="eyebrow reveal">MIVAAN JEWELLERS · MANGALSUTRA</span>
            <h1 className="reveal">A symbol of<br/><em>timeless love.</em></h1>
            <p className="reveal">Discover refined Mangalsutra designs where traditional meaning meets contemporary elegance.</p>
            <div className="hero-actions reveal">
              <button className="button gold" onClick={()=>document.getElementById("collection")?.scrollIntoView({behavior:"smooth"})}>Explore Collection</button>
              <a className="text-link" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">Enquire on WhatsApp <span>↗</span></a>
            </div>
            <div className="hero-signature reveal"><span>EST.</span><i></i><span>MIVAAN JEWELLERS</span></div>
          </div>
          <div className="hero-image reveal">
            <div className="hero-frame">
              <img src={products[0]?.images?.[0] || "/assets/products/design-01.jpg"} alt="Mivaan Mangalsutra"/>
              <div className="hero-caption"><span>01</span><span>THE COLLECTION</span></div>
            </div>
          </div>
        </section>

        <section id="collection" className="section collection">
          <div className="section-heading reveal"><span className="eyebrow">THE COLLECTION</span><h2>Latest Mangalsutra<br/><em>Designs</em></h2><p>A considered collection of elegant designs, presented one piece at a time.</p></div>
          <div className="product-grid">
            {products.map((p,i)=><div className={i===0 ? "product-feature reveal" : "reveal"} key={p.id}><ProductCard product={p} onOpen={setSelected}/></div>)}
          </div>
          {loading && <p className="loading">Loading latest collection…</p>}
        </section>

        {featured.length > 0 && (
          <section className="feature-banner">
            <div className="feature-copy reveal"><span className="eyebrow">SIGNATURE DETAILS</span><h2>Elegance in<br/><em>every detail.</em></h2><p>Thoughtfully designed Mangalsutras presented with a modern, refined sensibility — made to be remembered.</p><span className="feature-number">MIVAAN · 01</span></div>
            <div className="feature-image reveal"><img src={featured[0].images?.[0]} alt={featured[0].name}/><span className="image-label">SIGNATURE</span></div>
          </section>
        )}

        <section id="story" className="story section">
          <div className="story-image"><img src="/assets/products/design-03.jpg" alt="Mivaan Jewellers Mangalsutra"/></div>
          <div className="story-copy"><span className="eyebrow">OUR STORY</span><h2>Jewellery with meaning.</h2><p>Mivaan Jewellers presents Mangalsutra designs that bring together traditional symbolism and a clean, contemporary sense of elegance.</p><p>Explore the collection and speak directly with our team for product details, availability and enquiries.</p></div>
        </section>

        <section id="contact" className="contact-section">
          <span className="eyebrow">GET IN TOUCH</span>
          <h2>Find the design<br/><em>that feels yours.</em></h2>
          <p>For product details and availability, connect with Mivaan Jewellers directly.</p>
          <div className="contact-actions">
            <a className="button gold" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp Us</a>
            <a className="button outline light" href={`tel:${CONTACT}`}>Call Mivaan</a>
          </div>
        </section>
      </main>
      <footer><Logo/><span>© {new Date().getFullYear()} Mivaan Jewellers. All rights reserved.</span><button onClick={onAdmin}>Owner Login</button></footer>
      <a className="floating-whatsapp" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">◔</a>
      <ProductModal product={selected} onClose={()=>setSelected(null)}/>
    </>
  );
}

function App(){
  const [admin,setAdmin] = useState(window.location.pathname === "/admin");
  useEffect(()=>{
    const onPop=()=>setAdmin(window.location.pathname==="/admin");
    window.addEventListener("popstate",onPop); return()=>window.removeEventListener("popstate",onPop);
  },[]);
  function openAdmin(){ history.pushState({}, "", "/admin"); setAdmin(true); window.scrollTo(0,0); }
  function back(){ history.pushState({}, "", "/"); setAdmin(false); window.scrollTo(0,0); }
  return admin ? <Admin onBack={back}/> : <Site onAdmin={openAdmin}/>;
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(el=>el.classList.add("visible")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
    }), {threshold:0.12});
    items.forEach(el=>io.observe(el));
    return () => io.disconnect();
  });
}

function Root() {
  const [tick, setTick] = useState(0);
  useReveal();
  useEffect(()=>{ const onResize=()=>setTick(v=>v+1); window.addEventListener("resize",onResize); return()=>window.removeEventListener("resize",onResize); },[]);
  return <App key={tick}/>;
}
createRoot(document.getElementById("root")).render(<Root/>);
