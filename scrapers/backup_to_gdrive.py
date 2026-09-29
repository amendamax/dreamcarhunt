"""
Backup & Handover Generator for Google Drive Sync
VasileDev Group - September 11, 2026
Backs up conversation transcripts, creates human-readable chat logs,
generates the Monday Executive Handover Document, and zips dreamcarhunt-platform.
"""

import json
import os
import shutil
import sys
import zipfile
from datetime import datetime
from pathlib import Path

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

G_DRIVE = Path("G:/")
SYNC_DIR = G_DRIVE / "VASILEDEV_CLOUD_SYNC_2026"
ARCHIVE_DIR = G_DRIVE / "ARHIVA_CLOUD_CONVERSATII_AI_2026"
RAW_DIR = ARCHIVE_DIR / "RAW_JSONL_LOGS"
READABLE_DIR = ARCHIVE_DIR / "CONVERSATII_READABLE_MARKDOWN"

LOGS_SRC = Path(r"C:\Users\bratu\.gemini\antigravity\brain\0cbce7e4-1bce-43fc-ab54-1d71092f29d7\.system_generated\logs")
PLATFORM_SRC = Path(r"C:\Users\bratu\Desktop\dreamcarhunt-platform")

os.makedirs(SYNC_DIR, exist_ok=True)
os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(READABLE_DIR, exist_ok=True)

print("Starting Google Drive backup & handover sync...")

# 1. Copy Raw JSONL logs
raw_target = RAW_DIR / "transcript_2026-09-11_dreamcar_nesatto.jsonl"
raw_full_target = RAW_DIR / "transcript_full_2026-09-11_dreamcar_nesatto.jsonl"
shutil.copy2(LOGS_SRC / "transcript.jsonl", raw_target)
shutil.copy2(LOGS_SRC / "transcript_full.jsonl", raw_full_target)
print(f"Copied raw transcripts to {RAW_DIR}")

# 2. Parse transcript_full.jsonl into a clean readable markdown file
readable_file = READABLE_DIR / "CONVERSATIE_11_SEPTEMBRIE_2026_DREAMCAR_SI_VIKTORIJA_NESATTO.md"
messages = []

with open(LOGS_SRC / "transcript_full.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            data = json.loads(line)
            source = data.get("source")
            step_type = data.get("type")
            created_at = data.get("created_at", "")

            if source == "USER_EXPLICIT" or step_type == "USER_INPUT":
                content = data.get("content", "")
                if content:
                    messages.append(f"### 👤 VASILE [{created_at}]\n\n{content}\n")
            elif source == "MODEL" and step_type == "PLANNER_RESPONSE":
                content = data.get("content", "")
                if content:
                    messages.append(f"### 🤖 ANTIGRAVITY AI [{created_at}]\n\n{content}\n")
        except Exception:
            continue

with open(readable_file, "w", encoding="utf-8") as f:
    f.write("# 📜 Jurnal Complet Conversație — Vasile & Antigravity (11 Septembrie 2026)\n\n")
    f.write(f"**Data sincronizării**: {datetime.now().strftime('%d %B %Y %H:%M:%S')}\n\n")
    f.write(f"**Subiecte**: Lansare DreamCarHunt™ (Cloudflare D1, Nordic Scraper, Google Indexing) & Strategie Preluare Nesatto (Viktorija Rudanova / 40% Co-Founder).\n\n---\n\n")
    f.write("\n---\n\n".join(messages))

print(f"Generated human-readable chat journal: {readable_file} ({len(messages)} messages)")

# 3. Create DreamCarHunt zip backup
zip_target = SYNC_DIR / "dreamcarhunt-platform-BACKUP-11-SEPT-2026.zip"
print(f"Creating zip backup of DreamCarHunt platform to {zip_target}...")
with zipfile.ZipFile(zip_target, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(PLATFORM_SRC):
        # exclude .git and node_modules from backup to save space
        if ".git" in root or "node_modules" in root or ".wrangler" in root:
            continue
        for file in files:
            file_path = Path(root) / file
            arcname = file_path.relative_to(PLATFORM_SRC)
            zipf.write(file_path, arcname)

print("Created DreamCarHunt zip archive successfully!")

# 4. Generate Master Executive Handover Document
handover_content = """# 🎯 MASTER HANDOVER & STRATEGIE EXECUTIVĂ — LUNI 14 SEPTEMBRIE 2026
**Ecosistemul VasileDev Group | Pregătire pentru Laptop în România (Odobești)**
*Generat automat la data de 11 Septembrie 2026*

---

## 🏛️ 1. STADIUL CELOR 4 PILOANE DIN ECOSISTEM

| Pilon | Domeniu / Entitate | Rol / Model | Tehnologie & Infrastructură | Evaluare Țintă (4-5 ani) |
| :--- | :--- | :--- | :--- | :--- |
| **Pilonul 1** | `verifydating.net` | Anti-Scam & AI Facial Intelligence (B2C + B2B API) | Render Web Service + Python/FastAPI (Code Freeze activ) | **~10.000.000 €** |
| **Pilonul 2** | `isbrokersafe.com` | Broker & FinTech Compliance (B2C + B2B API) | Render Web Service + High-Yield Recovery Leads | **~10.000.000 €** |
| **Pilonul 3** | `dreamcarhunt.com` | Automotive AI Arbitrage Radar (Scandinavia ➔ UE) | Cloudflare Edge Worker + D1 SQLite (0.00 € cost) | **~10.000.000 €** |
| **Pilonul 4** | `Nesatto` (UK) | UK PropTech / Home-Buying Journey (Londra) | 40% Co-Founder & CTO (Parteneriat cu Viktorija) | **~8.000.000 – 10.000.000 €** (cota ta) |

**Valoare Totală Portofoliu Vizată: 30 – 40 Milioane de Euro.**

---

## 🚗 2. DREAMCARHUNT™ — SITUAȚIA TEHNICĂ (100% FINALIZAT FAZA 1)
* **Status Live**: `https://dreamcarhunt.com` (EN), `https://dreamcarhunt.com/ro/` (RO), `https://dreamcarhunt.com/it/` (IT).
* **Google Indexing**: **INDEXAT ÎN GOOGLE ÎN SUB 4 ORE** (`site:https://dreamcarhunt.com/` afișează titlul oficial, descrierea PR și favicon-ul).
* **Design**: Fotografia orizontală originală Porsche (`car_bg.webp`) la `center top`, secțiunea **How It Works** cu smooth scrolling adăugată pe toate limbile, optimizare mobilă impecabilă.
* **Baza de date Cloudflare D1 la Edge**: `dreamcarhunt-db` (ID: `5d26222d-f4ca-470f-ba21-0700a90ce76f`) în Western Europe (`WEUR`).
  * API-uri live: `/api/cars`, `/api/pr_codes`, `/api/stats`, `/api/leads`.
  * 4 exemplare factory unicorn sincronizate (Macan S Diesel, Audi A6 Allroad, BMW 530d Touring, Panamera 4S Diesel).
* **Nordic Scrapers (Python)**:
  * `scrapers/pr_decoder.py`: decodare automată a codurilor de fabrică (`9M9`, `VW6`, `1BK`).
  * `scrapers/nordic_collector.py`: calculator de arbitraj valutar SEK ➔ EUR.
  * `scrapers/sync_to_d1.py`: sincronizare directă cu D1.
* **GitHub**: `https://github.com/amendamax/dreamcarhunt` (commit `3d2a6a1`).

---

## 🇬🇧 3. DOSARUL VIKTORIJA RUDANOVA & NESATTO — PROTOCOLUL DE LUNI

### Cine este Viktorija & IDEAS Origination Ltd:
* **Entitatea**: `IDEAS Origination Limited` (Londra, UK) — consultanță de AI și Data Products (`ideaso.ai`).
* **Produsele ei**:
  * `Varyanto` (`varyanto.com`) — marketplace B2B de surplus (la care a lucrat săptămâna aceasta și este motivul întârzierii ei).
  * `Nesatto` (`nesatto.com`) — platformă PropTech pentru First-Time Buyers și brokeri din UK (pe care vrea să ți-o predea ție: *„deciding if you are up for taking over”*).

### Protocolul Juridic și de Protecție Personală:
1. **Zero Risc pe Italia**:
   * **Divorțul**: Nu este afectat, deoarece acordul de opțiune pe acțiuni viitoare este privat, de drept britanic, și nu apare în registrele italiene sau conturile bancare.
   * **Șomajul NASpI (până în Februarie 2027)**: Rămâne 100% neatins, deoarece nu încasezi salariu de angajat în Italia și nu deschizi societăți comerciale incompatibile cu INPS acum.
   * **Fiscul Italian (Agenzia delle Entrate)**: Nu există venit impozabil astăzi pentru o simplă opțiune pe acțiuni.
2. **Clauza Cheie de Introdus în Acord**:
   > *„...granted to Vasile Bratu or any corporate nominee / entity designated by him at the time of share issuance.”*
   * În primăvara lui 2027 (după ce se încheie divorțul și șomajul), acțiunile vor fi emise direct către noul tău **Holding SRL din România**!
3. **Scutirea Fiscală de 100% (Art. 23 lit. i din Codul Fiscal Român)**:
   * Holding-ul din România care deține peste 10% dintr-o firmă din UK de peste 1 an beneficiază de **0.00% IMPOZIT LA EXIT**!

---

### Strategia de Negociere pentru 40% (Cei 3 Pași):
1. **Pasul 1 (Luni)**: Când trimite NDA-ul, îl încarci în AI, îl analizăm clauză cu clauză și îl semnezi liniștit pe persoană fizică (*Vasile Bratu*).
2. **Pasul 2 (Marți)**: Preiei Figma-ul și specificațiile. Realizăm o analiză tehnică de nivel enterprise (arhitectură, module MVP, securitate GDPR UK) care să o lase mască.
3. **Pasul 3 (Discuția de Parteneriat 60 / 40)**:
   * O lași pe ea să definească nevoia de *„takeover”*.
   * Ancorezi împărțirea de Co-Founders:  
     **60% ea** (conduce afacerea, viziunea de business, clienții și investitorii britanici).  
     **40% tu** (Co-Founder Tehnic & CTO: preiei în totalitate dezvoltarea, arhitectura și livrarea platformei).
   * Crearea entității dedicate **`Nesatto Ltd`**, lăsându-i `Varyanto` 100% al ei pe firma ei veche.

---

## 📋 4. CHECKLIST DE LUNI PENTRU LAPTOP ÎN ROMÂNIA

- [ ] Deschizi laptopul la Odobești și verifici fișierul acesta de pe Google Drive (`G:\VASILEDEV_CLOUD_SYNC_2026\`).
- [ ] Deschizi conversația AI pe laptop.
- [ ] Verifici mesajele primite de la Viktorija cu NDA-ul.
- [ ] Încarci NDA-ul în AI pentru scanare juridică preliminară.
- [ ] Semnezi NDA-ul și soliciți link-urile de Figma și documentația funcțională.
- [ ] Începem planificarea tehnică a MVP-ului Nesatto pentru securizarea celor 40%!

---
*Document generat pentru Vasile Bratu — VasileDev Group. Păstrează confidențialitatea acestor informații.*
"""

handover_file = SYNC_DIR / "HANDOVER_LUNI_14_SEPTEMBRIE_2026.md"
handover_root = G_DRIVE / "HANDOVER_LUNI_14_SEPTEMBRIE_2026.md"

with open(handover_file, "w", encoding="utf-8") as f:
    f.write(handover_content)

with open(handover_root, "w", encoding="utf-8") as f:
    f.write(handover_content)

print(f"Generated Master Handover documents at {handover_file} and {handover_root}")
print("ALL BACKUPS AND HANDOVER PROTOCOLS COMPLETED SUCCESSFULLY!")
