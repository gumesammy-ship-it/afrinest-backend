import React, { useState, useEffect } from "react";
import {
  Search, ShieldCheck, MapPin, Bed, Bath, Maximize, Phone, ChevronRight,
  ChevronLeft, Home, Building2, Landmark, MessageCircle, Share2, Heart,
  Upload, Check, Loader2,
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

function ListingCard({ item, onOpen }) {
  return (
    <div onClick={() => onOpen(item.id)} className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
      <div className="h-40 bg-gradient-to-br from-blue-950 to-blue-800 relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)" }} />
        <TypeIcon type={item.type} className="w-10 h-10 text-white/70" />
        <span className="absolute top-3 left-3 bg-white/95 text-blue-950 text-xs font-bold px-2.5 py-1 rounded-full">{item.tag}</span>
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
          <p className="text-lg font-bold text-blue-950">{item.prix} <span className="text-xs font-medium text-stone-500">{item.tag === "À louer" ? "FCFA/mois" : "FCFA"}</span></p>
          <button className="text-amber-600 font-semibold text-sm flex items-center gap-0.5 group-hover:gap-1.5 transition-all">Voir <ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

function ListingDetail({ item, onBack }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-blue-950 mb-6">
        <ChevronLeft className="w-4 h-4" /> Retour aux annonces
      </button>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="h-72 rounded-2xl bg-gradient-to-br from-blue-950 to-blue-800 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)" }} />
            <TypeIcon type={item.type} className="w-16 h-16 text-white/60" />
            <span className="absolute top-4 left-4 bg-white/95 text-blue-950 text-xs font-bold px-3 py-1.5 rounded-full">{item.tag}</span>
            {item.verifie && <span className="absolute top-4 right-4"><VerifiedBadge /></span>}
          </div>
          <div className="flex items-start justify-between mt-6">
            <div>
              <h1 className="text-2xl font-semibold text-blue-950" style={{ fontFamily: "'Fraunces', serif" }}>{item.titre}</h1>
              <p className="flex items-center gap-1 text-stone-500 mt-1"><MapPin className="w-4 h-4" /> {item.ville}</p>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-red-500 hover:border-red-200"><Heart className="w-4 h-4" /></button>
              <button className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-blue-950"><Share2 className="w-4 h-4" /></button>
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
            <p className="text-2xl font-bold text-blue-950">{item.prix} <span className="text-sm font-medium text-stone-500">{item.tag === "À louer" ? "FCFA/mois" : "FCFA"}</span></p>
            <p className="text-sm text-stone-500 mt-1">Publié par {item.agence || "Particulier"}</p>
            <button className="w-full mt-5 bg-amber-600 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> {item.telephone}
            </button>
            <button className="w-full mt-2 border border-stone-200 text-stone-700 font-semibold text-sm py-2.5 rounded-xl hover:border-blue-950 hover:text-blue-950 transition-colors flex items-center justify-center gap-2">
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

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 transition-shadow";

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
        <h2 className="text-2xl font-semibold text-blue-950" style={{ fontFamily: "'Fraunces', serif" }}>
          Annonce envoyée et enregistrée !
        </h2>
        <p className="text-stone-600 mt-2 text-sm">
          Ton annonce "{form.titre}" est maintenant dans la base de données AfriNest.
          Elle apparaît déjà dans la liste — notre équipe la vérifiera pour lui donner le badge "Bien Vérifié".
        </p>
        <button onClick={onBack} className="mt-6 bg-blue-950 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-blue-900 transition-colors">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-blue-950 mb-6">
        <ChevronLeft className="w-4 h-4" /> Retour
      </button>
      <h1 className="text-2xl font-semibold text-blue-950" style={{ fontFamily: "'Fraunces', serif" }}>Publier une annonce</h1>
      <p className="text-stone-500 text-sm mt-1 mb-8">Décris ton bien, notre équipe le vérifie avant mise en ligne.</p>

      {status === "error" && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
          L'envoi a échoué. Vérifie ta connexion et réessaie.
          <br />
          <span className="text-xs opacity-70">Détail : {errorDetail}</span>
        </div>
      )}
      {status === "missing" && (
              <div className="mb-5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
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
          className="w-full bg-amber-600 text-white font-semibold text-sm py-3 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60"
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
    <div className="min-h-screen bg-amber-50 text-stone-900" style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}>
      <header className="sticky top-0 z-20 bg-amber-50/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-950" />
            <span className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif" }}>AfriNest</span>
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#annonces" className="hover:text-blue-950">Annonces</a>
            <a href="#comment" className="hover:text-blue-950">Comment ça marche</a>
          </nav>
          <button onClick={() => { setSelectedId(null); setView("publish"); }} className="bg-blue-950 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-900 transition-colors">
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
          <section className="max-w-6xl mx-auto px-6 pt-14 pb-16">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Togo · Afrique de l'Ouest</span>
              <h1 className="text-4xl md:text-5xl leading-[1.1] font-semibold text-blue-950" style={{ fontFamily: "'Fraunces', serif" }}>
                Votre futur logement commence ici.
              </h1>
              <p className="mt-4 text-stone-600 text-lg">
                Trouvez un bien vérifié, contactez directement le propriétaire, évitez les arnaques.
              </p>
            </div>
            <div className="mt-8 bg-white rounded-2xl border border-stone-200 shadow-sm p-2 flex flex-col md:flex-row gap-2 max-w-3xl">
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
              <button className="bg-amber-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-amber-700 transition-colors">Rechercher</button>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Connecté à ta base de données AfriNest en direct.
            </div>
          </section>

          <section id="annonces" className="max-w-6xl mx-auto px-6 pb-16">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-semibold text-blue-950" style={{ fontFamily: "'Fraunces', serif" }}>Annonces récentes</h2>
              <button onClick={loadListings} className="text-sm font-semibold text-amber-600">Rafraîchir</button>
            </div>

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
                {filtered.map((item) => (
                  <ListingCard key={item.id} item={item} onOpen={setSelectedId} />
                ))}
              </div>
            )}
          </section>

          <section id="comment" className="bg-blue-950 py-16">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-2xl font-semibold text-white mb-10" style={{ fontFamily: "'Fraunces', serif" }}>Comment ça marche</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((s, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-11 h-11 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-white font-semibold">{s.label}</h3>
                    <p className="text-stone-300 text-sm leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-blue-950" />
          <span className="font-semibold text-stone-700">AfriNest</span>
        </div>
        <p>Publication gratuite pour les particuliers.</p>
      </footer>
    </div>
  );
    }
