/* StatObs Élèves (Applis EPS Élèves) – fonctions communes : séance en cours,
   identification observateur / élève observé, fichier .xlsx au nom de l'élève observé
   au format type « Mes Apps EPS », installation PWA. 100 % local, aucune base élèves. */
(function () {
  'use strict';

  const APP = 'statobs';                      // nom de la feuille (identique à la version enseignant)
  const K = { config: 'statobsEleveConfig', counts: 'statobsEleveCounts', cur: 'statobsEleveCurrent', final: 'statobsEleveFinal' };
  const S = window.StatObs = { APP, K, ME: 'statobsEleveMoi', PREFILL: 'statobsElevePrefill', SAVED: 'statobsEleveSaved' };

  S.read  = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  S.write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  S.clearSession = () => [...Object.values(K), S.SAVED].forEach(k => localStorage.removeItem(k));
  S.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  S.fmtDuration = ms => {
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  };
  S.toast = msg => {
    const n = document.createElement('div');
    n.className = 'toast'; n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3500);
  };

  /* Identité au format Pronote / Mes Apps EPS : NOM en majuscules, Prénom capitalisé */
  S.fixNom = v => String(v || '').trim().replace(/\s+/g, ' ').toUpperCase();
  S.fixPrenom = v => String(v || '').trim().replace(/\s+/g, ' ').toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
  S.fixClasse = v => String(v || '').trim().replace(/\s+/g, ' ').toUpperCase();
  S.person = (id, n, p, c) => ({ id, n: S.fixNom(n), p: S.fixPrenom(p), classe: S.fixClasse(c), nom: (S.fixNom(n) + ' ' + S.fixPrenom(p)).trim() });
  S.label = o => `${o.nom} (${o.classe})`;

  const ascii = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9-]+/g, '_').replace(/^_+|_+$/g, '');
  S.fileName = f => { const e = f.joueurs[0]; return `StatObs_${ascii(e.n)}_${ascii(e.p)}_${ascii(e.classe)}_${StatObsBilan.dateOf(f)}.xlsx`; };

  /* Fichier de sauvegarde (format Mes Apps EPS « fichier d'un élève », sans feuille Élèves) :
     statobs (une ligne au nom de l'élève observé) + _meta. Le professeur l'importe dans StatObs ou
     Mes Apps EPS : la ligne est rattachée à l'élève par Nom + Prénom + Classe. */
  S.exportXlsx = async f => {
    const B = StatObsBilan, e = f.joueurs[0], o = f.observateurs[0];
    const blob = EPSXLSX.build([
      { name: APP, rows: [['Nom', 'Prénom', 'Né(e) le', 'Classe', ...B.header(f.items.length)],
        [e.n, e.p, '', e.classe, ...B.sheetCells(f, e.id, 'Pratiquant', { observateurs: S.label(o), observes: e.nom })]] },
      { name: '_meta', hidden: true, rows: [['Feuille', 'Application', 'Mode'], [APP, APP, 'lignes']] }
    ]);
    await EPSXLSX.save(blob, S.fileName(f));
    localStorage.setItem(S.SAVED, String(f.id));
  };

  /* ── PWA : service worker, bouton d'installation (Android/PC), aide iOS ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW', e)));
  }
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferred = e;
    const b = document.getElementById('installBtn'); if (b) b.hidden = false;
  });
  window.addEventListener('appinstalled', () => { const b = document.getElementById('installBtn'); if (b) b.hidden = true; });
  document.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('installBtn');
    if (b) b.addEventListener('click', async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; b.hidden = true; });
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const h = document.getElementById('iosHint');
    if (h && ios && !standalone) h.hidden = false;
  });
})();
