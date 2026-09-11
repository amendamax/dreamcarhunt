function calculateSavings() {
    const sekInput = document.getElementById('calc-sek');
    const eurOutput = document.getElementById('calc-eur');
    const diffOutput = document.getElementById('calc-diff');

    if (!sekInput) return;
    const sek = parseFloat(sekInput.value) || 0;
    const rate = 11.4; // 1 EUR = ~11.4 SEK
    const netEur = Math.round(sek / rate);
    const localMarket = Math.round(netEur * 1.17); // ~17% diferență piață locală
    const diff = localMarket - netEur;

    eurOutput.innerText = netEur.toLocaleString('de-DE') + ' €';
    diffOutput.innerText = '+' + diff.toLocaleString('de-DE') + ' €';
}

function applyFilter(filterCode) {
    const pills = document.querySelectorAll('.pill');
    pills.forEach(p => p.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const searchInput = document.getElementById('ai-search-input');
    if (filterCode === '9M9') searchInput.value = 'Porsche Macan cu încălzire Webasto (9M9)';
    if (filterCode === 'VW6') searchInput.value = 'Porsche cu geamuri duble fonoizolante (VW6)';
    if (filterCode === '1BK') searchInput.value = 'Modele cu suspensie pneumatică adaptivă (1BK)';
    if (filterCode === 'SEK') searchInput.value = 'Exemplare din Suedia cu arbitraj valutar';
}

function triggerSearch() {
    const query = document.getElementById('ai-search-input').value.trim();
    if (!query) return;
    
    // Scroll fluent către galeria de inorogi
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

    // Stocare în LocalStorage
    const leadData = {
        model, budget, name, phone, email, options,
        timestamp: new Date().toISOString()
    };
    
    let existingLeads = JSON.parse(localStorage.getItem('dreamcarhunt_leads') || '[]');
    existingLeads.push(leadData);
    localStorage.setItem('dreamcarhunt_leads', JSON.stringify(existingLeads));

    // Afișare banner succes
    document.getElementById('order-form').style.display = 'none';
    document.getElementById('success-banner').classList.remove('hidden');

    console.log('Lead înregistrat:', leadData);
}

document.addEventListener('DOMContentLoaded', () => {
    calculateSavings();
});
