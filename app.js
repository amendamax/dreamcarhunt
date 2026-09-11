function calculateSavings() {
    const sekInput = document.getElementById('calc-sek');
    const eurOutput = document.getElementById('calc-eur');
    const diffOutput = document.getElementById('calc-diff');

    if (!sekInput) return;
    const sek = parseFloat(sekInput.value) || 0;
    const rate = 11.4; // 1 EUR = ~11.4 SEK
    const netEur = Math.round(sek / rate);
    const localMarket = Math.round(netEur * 1.17); // ~17% difference
    const diff = localMarket - netEur;

    const lang = document.documentElement.lang || 'en';
    const locale = lang === 'ro' ? 'ro-RO' : (lang === 'it' ? 'it-IT' : 'de-DE');

    eurOutput.innerText = (lang === 'en' ? '€' : '') + netEur.toLocaleString(locale) + (lang !== 'en' ? ' €' : '');
    diffOutput.innerText = '+' + (lang === 'en' ? '€' : '') + diff.toLocaleString(locale) + (lang !== 'en' ? ' €' : '');
}

function applyFilter(filterCode) {
    const pills = document.querySelectorAll('.pill');
    pills.forEach(p => p.classList.remove('active'));
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    const searchInput = document.getElementById('ai-search-input');
    const lang = document.documentElement.lang || 'en';

    if (lang === 'ro') {
        if (filterCode === '9M9') searchInput.value = 'Porsche Macan cu încălzire Webasto (9M9)';
        if (filterCode === 'VW6') searchInput.value = 'Audi sau Porsche cu geamuri duble (VW6/VW0)';
        if (filterCode === '1BK') searchInput.value = 'Modele cu suspensie pneumatică adaptivă (1BK/1BY)';
        if (filterCode === 'SEK') searchInput.value = 'Exemplare din Suedia cu arbitraj valutar';
    } else if (lang === 'it') {
        if (filterCode === '9M9') searchInput.value = 'Porsche Macan con riscaldamento Webasto (9M9)';
        if (filterCode === 'VW6') searchInput.value = 'Audi o Porsche con doppi vetri acustici (VW6/VW0)';
        if (filterCode === '1BK') searchInput.value = 'Modelli con sospensioni pneumatiche (1BK/1BY)';
        if (filterCode === 'SEK') searchInput.value = 'Esemplari dalla Svezia con arbitraggio valutario';
    } else {
        if (filterCode === '9M9') searchInput.value = 'Porsche Macan with factory Webasto heater (9M9)';
        if (filterCode === 'VW6') searchInput.value = 'Audi or Porsche with acoustic double glass (VW6/VW0)';
        if (filterCode === '1BK') searchInput.value = 'Vehicles with adaptive air suspension (1BK/1BY)';
        if (filterCode === 'SEK') searchInput.value = 'Scandinavian vehicles with currency arbitrage';
    }
}

function triggerSearch() {
    const query = document.getElementById('ai-search-input').value.trim();
    if (!query) return;
    
    const unicornsSection = document.getElementById('unicorns');
    if (unicornsSection) {
        unicornsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function submitLead(e) {
    e.preventDefault();
    const model = document.getElementById('lead-model').value;
    const budget = document.getElementById('lead-budget').value;
    const name = document.getElementById('lead-name').value;
    const phone = document.getElementById('lead-phone').value;
    const email = document.getElementById('lead-email').value;

    const options = [];
    document.querySelectorAll('.checkbox-row input:checked').forEach(cb => options.push(cb.value));

    const lang = document.documentElement.lang || 'en';

    const leadData = {
        model, budget, name, phone, email, options, lang,
        timestamp: new Date().toISOString()
    };
    
    // Save to local storage as client-side backup
    let existingLeads = JSON.parse(localStorage.getItem('dreamcarhunt_leads') || '[]');
    existingLeads.push(leadData);
    localStorage.setItem('dreamcarhunt_leads', JSON.stringify(existingLeads));

    // Send asynchronously to Cloudflare D1 SQLite Database at Edge
    fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            phone,
            email,
            model,
            budget,
            options,
            lang
        })
    }).then(res => res.json())
      .then(data => console.log('Saved to Cloudflare D1:', data))
      .catch(err => console.warn('D1 sync notice:', err));

    // Dynamic Multilingual WhatsApp Message
    let waMsgText = '';
    if (lang === 'ro') {
        waMsgText = `Salut! Sunt ${name}. Am plasat o comandă de vânătoare pe DreamCarHunt™:\n\n🚗 Model: ${model}\n💰 Buget Maxim: ${budget} €\n🛠️ Dotări Obligatorii: ${options.join(', ') || 'Standard de top'}\n📞 Tel: ${phone}\n✉️ Email: ${email}`;
    } else if (lang === 'it') {
        waMsgText = `Ciao! Sono ${name}. Ho inviato una richiesta di ricerca su DreamCarHunt™:\n\n🚗 Modello: ${model}\n💰 Budget Massimo: ${budget} €\n🛠️ Dotazioni: ${options.join(', ') || 'Top di gamma'}\n📞 Tel: ${phone}\n✉️ Email: ${email}`;
    } else {
        waMsgText = `Hello! I am ${name}. I submitted a car hunt request on DreamCarHunt™:\n\n🚗 Model: ${model}\n💰 Max Budget: €${budget}\n🛠️ Mandatory Options: ${options.join(', ') || 'Top Spec'}\n📞 Phone: ${phone}\n✉️ Email: ${email}`;
    }

    const waBtn = document.getElementById('lead-wa-btn');
    if (waBtn) {
        waBtn.href = `https://wa.me/393209481876?text=${encodeURIComponent(waMsgText)}`;
    }

    document.getElementById('order-form').style.display = 'none';
    document.getElementById('success-banner').classList.remove('hidden');

    console.log('Lead registered:', leadData);
}

document.addEventListener('DOMContentLoaded', () => {
    calculateSavings();
});
