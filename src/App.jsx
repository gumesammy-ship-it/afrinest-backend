      .catch((err) => {
        setLoadErrorDetail(String(err && err.message ? err.message : err));
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadListings(); }, []);

  const selected = listings.find((l) => l.id === selectedId);
  const goHome = () => { setSelectedId(null); setView("home"); };

  const filtered = listings.filter((l) =>
    !query || (l.ville || "").toLowerCase().includes(query.toLowerCase()) || (l.titre || "").toLowerCase().includes(query.toLowerCase())
  );

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
