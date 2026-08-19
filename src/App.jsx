import React, { useState, useEffect, useRef } from "react";
import {
  Search, ShieldCheck, MapPin, Bed, Bath, Maximize, Phone, ChevronRight,
  ChevronLeft, Home, Building2, Landmark, MessageCircle, Share2, Heart,
  Upload, Check, Loader2, CheckCircle2, Clock,
} from "lucide-react";

const SUPABASE_URL = "https://ktipfykdptdcsarwdcum.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aXBmeWtkcHRkY3NhcndkY3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MDU2NDgsImV4cCI6MjEwMTE4MTY0OH0.uriZCULV5C2HXXppe4NxloS-LD5PS0F9mpzXYV8Y8PM";

async function fetchAnnonces() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/annonces?select=*&order=created_at.desc&apikey=${SUPABASE_KEY}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${body}`);
  }
  return res.json();
}

async function insertAnnonce(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/annonces`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${body}`);
  }
  return res.json();
}

const steps = [
  { icon: Search, label: "Recherchez", text: "Filtrez par ville, budget et type de bien en quelques secondes." },
  { icon: ShieldCheck, label: "Vérifiez", text: "Chaque annonce vérifiée porte le badge Bien Vérifié." },
  { icon: Phone, label: "Contactez", text: "Échangez directement avec le propriétaire ou l'agence, sans intermédiaire caché." },
];

const raisons = [
  { icon: ShieldCheck, label: "Annonces vérifiées", text: "Nous vérifions les informations importantes du bien pour plus de confiance." },
  { icon: Phone, label: "Contact direct", text: "Échangez directement avec le propriétaire, sans intermédiaire." },
  { icon: CheckCircle2, label: "Moins d'arnaques", text: "Des annonces plus transparentes pour chercher en toute sérénité." },
  { icon: Clock, label: "Gain de temps", text: "Trouvez rapidement le bien qui correspond à vos besoins et à votre budget." },
];

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <ShieldCheck className="w-3.5 h-3.5" /> Bien Vérifié
    </span>
  );
}

function TypeIcon({ type, className }) {
  if (type === "Terrain") return <Landmark className={className} />;
  if (type === "Villa") return <Home className={className} />;
  return <Building2 className={className} />;
}

const TYPE_IMAGES = {
  Villa: "https://images.unsplash.com/photo-1661332618293-6b6204cd87fc?auto=format&fit=crop&w=800&q=70",
  Terrain: "https://images.unsplash.com/photo-1506695041619-5dd4f46960b7?auto=format&fit=crop&w=800&q=70",
  Appartement: "https://images.unsplash.com/photo-1658872180512-7ee222963246?auto=format&fit=crop&w=800&q=70",
  Studio: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=70",
};

function ListingCard({ item, onOpen }) {
  return (
    <div onClick={() => onOpen(item.id)} className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer">
      <div className="h-40 relative overflow-hidden">
        <img
          src={TYPE_IMAGES[item.type] || TYPE_IMAGES.Appartement}
          alt={item.type}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/60 via-ocean-900/10 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/95 text-ocean-900 text-xs font-bold px-2.5 py-1 rounded-full">{item.tag}</span>
        {item.verifie && <span className="absolute top-3 right-3"><VerifiedBadge /></span>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 leading-snug">{item.titre}</h3>
        <p className="flex items-center gap-1 text-sm text-stone-500 mt-1"><MapPin className="w-3.5 h-3.5" /> {item.ville}</p>
        <div className="flex items-center gap-3 mt-3 text-sm text-stone-600">
          {!!item.chambres && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{item.chambres}</span>}
          {!!item.taille && <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{item.taille} m²</span>}
        </div>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-lg font-bold text-ocean-900">{item.prix} <span className="text-xs font-medium text-stone-500">{item.tag === "À louer" ? "FCFA/mois" : "FCFA"}</span></p>
          <button className="text-ocean-500 font-semibold text-sm flex items-center gap-0.5 group-hover:gap-1.5 transition-all">Voir <ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

function ListingDetail({ item, onBack }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-ocean-900 mb-6">
        <ChevronLeft className="w-4 h-4" /> Retour aux annonces
      </button>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="h-72 rounded-2xl relative overflow-hidden">
            <img
              src={TYPE_IMAGES[item.type] || TYPE_IMAGES.Appartement}
              alt={item.type}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/50 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 bg-white/95 text-ocean-900 text-xs font-bold px-3 py-1.5 rounded-full">{item.tag}</span>
            {item.verifie && <span className="absolute top-4 right-4"><VerifiedBadge /></span>}
          </div>
          <div className="flex items-start justify-between mt-6">
            <div>
              <h1 className="text-2xl font-semibold text-ocean-900" style={{ fontFamily: "'Clash Display', sans-serif" }}>{item.titre}</h1>
              <p className="flex items-center gap-1 text-stone-500 mt-1"><MapPin className="w-4 h-4" /> {item.ville}</p>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-red-500 hover:border-red-200"><Heart className="w-4 h-4" /></button>
              <button className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-ocean-900"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-stone-600 border-y border-stone-200 py-4">
            {!!item.chambres && <span className="flex items-center gap-1.5"><Bed className="w-4 h-4" />{item.chambres} chambres</span>}
            {!!item.taille && <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4" />{item.taille} m²</span>}
          </div>
          <h2 className="font-semibold text-stone-900 mt-6 mb-2">Description</h2>
          <p className="text-stone-600 leading-relaxed text-sm">{item.description}</p>
        </div>
        <div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-24">
            <p className="text-2xl font-bold text-ocean-900">{item.prix} <span className="text-sm font-medium text-stone-500">{item.tag === "À louer" ? "FCFA/mois" : "FCFA"}</span></p>
            <p className="text-sm text-stone-500 mt-1">Publié par {item.agence || "Particulier"}</p>
            <button className="w-full mt-5 bg-ocean-500 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-ocean-700 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> {item.telephone}
            </button>
            <button className="w-full mt-2 border border-stone-200 text-stone-700 font-semibold text-sm py-2.5 rounded-xl hover:border-ocean-900 hover:text-ocean-900 transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> Envoyer un message
            </button>
            {item.verifie && (
              <div className="mt-4 flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" /> Ce bien a été vérifié sur place par l'équipe AfriNest.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/10 transition-shadow";

function PublishForm({ onBack, onPublished }) {
  const [form, setForm] = useState({
    titre: "", type: "Villa", tag: "À vendre", ville: "", prix: "",
    chambres: "", taille: "", description: "", agence: "", telephone: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const [errorDetail, setErrorDetail] = useState("");
  const [clickTest, setClickTest] = useState(0);
  const requiredOk = form.titre && form.ville && form.prix && form.taille && form.description && form.agence && form.telephone;

  const handleSubmit = async () => {
    setClickTest((n) => n + 1);
    if (!requiredOk) {
      setStatus("missing");
      return;
    }
    setStatus("sending");
    try {
      const [created] = await insertAnnonce({
        titre: form.titre,
        type: form.type,
        tag: form.tag,
        ville: form.ville,
        prix: form.prix,
        chambres: form.chambres ? parseInt(form.chambres, 10) : null,
        taille: form.taille,
        description: form.description,
        agence: form.agence,
        telephone: form.telephone,
        verifie: false,
      });
      onPublished(created);
      setStatus("done");
    } catch (err) {
      setErrorDetail(String(err && err.message ? err.message : err));
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-semibold text-ocean-900" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          Annonce envoyée et enregistrée !
        </h2>
        <p className="text-stone-600 mt-2 text-sm">
          Ton annonce "{form.titre}" est maintenant dans la base de données AfriNest.
          Elle apparaît déjà dans la liste — notre équipe la vérifiera pour lui donner le badge "Bien Vérifié".
        </p>
        <button onClick={onBack} className="mt-6 bg-ocean-900 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-ocean-700 transition-colors">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-ocean-900 mb-6">
        <ChevronLeft className="w-4 h-4" /> Retour
      </button>
      <h1 className="text-2xl font-semibold text-ocean-900" style={{ fontFamily: "'Clash Display', sans-serif" }}>Publier une annonce</h1>
      <p className="text-stone-500 text-sm mt-1 mb-8">Décris ton bien, notre équipe le vérifie avant mise en ligne.</p>

      {status === "error" && (
              <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
          L'envoi a échoué. Vérifie ta connexion et réessaie.
          <br />
          <span className="text-xs opacity-70">Détail : {errorDetail}</span>
        </div>
      )}
      {status === "missing" && (
        <div className="mb-5 text-sm text-ocean-700 bg-ocean-100 border border-amber-200 rounded-xl p-3">
          Merci de remplir tous les champs obligatoires (titre, ville, prix, superficie, description, nom, téléphone).
        </div>
      )}

      <p className="text-xs text-stone-400 mb-2">Clics détectés : {clickTest} — status actuel : "{status}" — requiredOk : {String(requiredOk)}</p>

      <div className="space-y-5">
        <Field label="Titre de l'annonce">
          <input required className={inputClass} placeholder="Ex: Villa moderne 4 pièces" value={form.titre} onChange={update("titre")} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type de bien">
            <select className={inputClass} value={form.type} onChange={update("type")}>
              <option>Villa</option><option>Appartement</option><option>Terrain</option><option>Studio</option>
            </select>
          </Field>
          <Field label="Transaction">
            <select className={inputClass} value={form.tag} onChange={update("tag")}>
              <option>À vendre</option><option>À louer</option>
            </select>
          </Field>
        </div>
        <Field label="Ville / quartier">
          <input required className={inputClass} placeholder="Ex: Lomé, Agoè" value={form.ville} onChange={update("ville")} />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Prix">
            <input required className={inputClass} placeholder="Ex: 45 000 000" value={form.prix} onChange={update("prix")} />
          </Field>
          <Field label="Chambres">
            <input type="number" min="0" className={inputClass} value={form.chambres} onChange={update("chambres")} />
          </Field>
          <Field label="Superficie (m²)">
            <input required className={inputClass} value={form.taille} onChange={update("taille")} />
          </Field>
        </div>
        <Field label="Description">
          <textarea required rows={4} className={inputClass} placeholder="Décris le bien, son état, ses atouts..." value={form.description} onChange={update("description")} />
        </Field>
        <Field label="Photos" hint="Fonctionnalité à venir.">
          <div className="border-2 border-dashed border-stone-200 rounded-xl py-8 flex flex-col items-center gap-2 text-stone-400">
            <Upload className="w-6 h-6" /><span className="text-sm">Glisser des photos ici</span>
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom / agence">
            <input required className={inputClass} value={form.agence} onChange={update("agence")} />
          </Field>
          <Field label="Téléphone">
            <input required className={inputClass} placeholder="+228 ..." value={form.telephone} onChange={update("telephone")} />
          </Field>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "sending"}
          className="w-full bg-ocean-500 text-white font-semibold text-sm py-3 rounded-xl hover:bg-ocean-700 transition-colors disabled:opacity-60"
        >
          {status === "sending" ? "Envoi en cours..." : "Envoyer l'annonce pour vérification"}
        </button>
      </div>
    </div>
  );
}

export default function AfriNestSite() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [filterBudget, setFilterBudget] = useState("Tous");
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("home");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadErrorDetail, setLoadErrorDetail] = useState("");

  const loadListings = () => {
    setLoading(true);
    setLoadError(false);
    fetchAnnonces()
      .then((data) => setListings(data))
      .catch((err) => {
        setLoadErrorDetail(String(err && err.message ? err.message : err));
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadListings(); }, []);

  const selected = listings.find((l) => l.id === selectedId);
  const goHome = () => { setSelectedId(null); setView("home"); };

  const priceToNumber = (prix) => parseInt(String(prix || "0").replace(/[^0-9]/g, ""), 10) || 0;

  const filtered = listings.filter((l) => {
    const matchQuery = !query || (l.ville || "").toLowerCase().includes(query.toLowerCase()) || (l.titre || "").toLowerCase().includes(query.toLowerCase());
    const matchType = filterType === "Tous" || l.type === filterType;
    const prixNum = priceToNumber(l.prix);
    const matchBudget =
      filterBudget === "Tous" ||
      (filterBudget === "moins10" && prixNum < 10000000) ||
      (filterBudget === "10a50" && prixNum >= 10000000 && prixNum <= 50000000) ||
      (filterBudget === "plus50" && prixNum > 50000000);
    return matchQuery && matchType && matchBudget;
  });

  return (
    <div className="min-h-screen bg-ocean-100 text-stone-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header className="sticky top-0 z-20 bg-ocean-100/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-ocean-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Home className="w-5 h-5 text-ocean-300" strokeWidth={2.5} />
            </span>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>Afri<span className="text-ocean-500">Nest</span></span>
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#annonces" className="hover:text-ocean-900">Annonces</a>
            <a href="#comment" className="hover:text-ocean-900">Comment ça marche</a>
          </nav>
          <button onClick={() => { setSelectedId(null); setView("publish"); }} className="bg-ocean-900 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-ocean-700 transition-colors">
            Publier une annonce
          </button>
        </div>
      </header>

      {view === "publish" ? (
        <PublishForm onBack={goHome} onPublished={(created) => setListings((prev) => [created, ...prev])} />
      ) : selected ? (
        <ListingDetail item={selected} onBack={goHome} />
      ) : (
        <>
          <section className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1586228046763-cd367fc926bf?auto=format&fit=crop&w=1600&q=70"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/85 via-ocean-900/75 to-ocean-100" />
            </div>
            <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
              <div className="max-w-2xl animate-[fadeInUp_0.7s_ease-out]">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-ocean-300 mb-3">Togo · Afrique de l'Ouest</span>
                <h1 className="text-4xl md:text-5xl leading-[1.1] font-semibold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                  Votre futur logement commence ici.
                </h1>
                <p className="mt-4 text-ocean-100 text-lg">
                  Trouvez un bien vérifié, contactez directement le propriétaire, évitez les arnaques.
                </p>
              </div>
              <div className="mt-8 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl animate-[fadeInUp_0.7s_ease-out_0.15s_both]">
                <div className="flex-1 flex items-center gap-2 px-3 py-2">
                  <Search className="w-5 h-5 text-stone-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ville, quartier (ex: Lomé, Agoè...)" className="w-full outline-none text-sm placeholder:text-stone-400" />
                </div>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 outline-none">
                  <option value="Tous">Tous types</option>
                  <option value="Villa">Villa</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Terrain">Terrain</option>
                  <option value="Studio">Studio</option>
                </select>
                <select value={filterBudget} onChange={(e) => setFilterBudget(e.target.value)} className="px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 outline-none">
                  <option value="Tous">Tous budgets</option>
                  <option value="moins10">Moins de 10M FCFA</option>
                  <option value="10a50">10M - 50M FCFA</option>
                  <option value="plus50">Plus de 50M FCFA</option>
                </select>
              <button className="bg-ocean-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-ocean-700 transition-colors">Rechercher</button>
            </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-ocean-100">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Connecté à ta base de données AfriNest en direct.
              </div>
            </div>
          </section>

          <section id="annonces" className="max-w-6xl mx-auto px-6 pb-16">
            <Reveal>
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl font-semibold text-ocean-900" style={{ fontFamily: "'Clash Display', sans-serif" }}>Annonces récentes</h2>
                <button onClick={loadListings} className="text-sm font-semibold text-ocean-500 hover:text-ocean-700 transition-colors">Rafraîchir</button>
              </div>
            </Reveal>

            {loading && (
              <div className="flex items-center gap-2 text-stone-500 text-sm py-10 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Chargement des annonces...
              </div>
            )}

            {loadError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                Impossible de charger les annonces. Vérifie la connexion à Supabase.
                <br />
                <span className="text-xs opacity-70">Détail : {loadErrorDetail}</span>
              </div>
            )}

            {!loading && !loadError && filtered.length === 0 && (
              <div className="text-center text-stone-500 text-sm py-10 border border-dashed border-stone-300 rounded-2xl">
                Aucune annonce pour l'instant — clique sur "Publier une annonce" pour ajouter la première !
              </div>
            )}

            {!loading && !loadError && filtered.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filtered.map((item, i) => (
                  <Reveal key={item.id} delay={i * 90}>
                    <ListingCard item={item} onOpen={setSelectedId} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>

          <section id="comment" className="bg-ocean-900 py-16">
            <div className="max-w-6xl mx-auto px-6">
              <Reveal>
                <h2 className="text-2xl font-semibold text-white mb-10" style={{ fontFamily: "'Clash Display', sans-serif" }}>Comment ça marche</h2>
              </Reveal>
              <div className="grid md:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                  <Reveal key={i} delay={i * 130}>
                    <div className="relative h-full bg-white/[0.06] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/[0.1] hover:border-ocean-500/40 hover:-translate-y-1 transition-all duration-300 group">
                      <span className="absolute top-5 right-5 text-4xl font-bold text-white/10 select-none" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                        0{i + 1}
                      </span>
                      <div className="w-14 h-14 rounded-2xl bg-ocean-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <s.icon className="w-7 h-7 text-ocean-500" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mt-5">{s.label}</h3>
                      <p className="text-stone-300 text-sm leading-relaxed mt-2">{s.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 py-16">
            <Reveal>
              <h2 className="text-2xl font-semibold text-ocean-900 mb-8" style={{ fontFamily: "'Clash Display', sans-serif" }}>Pourquoi choisir AfriNest ?</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {raisons.map((r, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="h-full bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 hover:border-ocean-300 transition-all duration-300 group">
                    <div className="w-11 h-11 rounded-xl bg-ocean-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <r.icon className="w-5 h-5 text-ocean-700" />
                    </div>
                    <h3 className="font-semibold text-stone-900 mt-4">{r.label}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed mt-1.5">{r.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </>
      )}

      <footer className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-ocean-900" />
          <span className="font-semibold text-stone-700">AfriNest</span>
        </div>
        <p>Publication gratuite pour les particuliers.</p>
      </footer>
    </div>
  );
  }
