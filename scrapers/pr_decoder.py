"""
DreamCarHunt™ PR Code & Equipment Decoder Engine
VasileDev Group - Automotive Data Intelligence
Supports VAG (Porsche, Audi, VW), BMW, and Mercedes equipment decoding.
Maps Swedish/German/English dealer listings and official specs to PR Codes.
"""

import re
from typing import Dict, List, Optional, Any

# Canonical PR Codes Catalog
PR_CATALOG: Dict[str, Dict[str, Any]] = {
    # CLIMATE / WEBASTO
    "9M9": {
        "brand": "VAG",
        "category": "CLIMATE",
        "name_en": "Factory Webasto Auxiliary Heater with Remote Control",
        "name_ro": "Încălzire Auxiliară Webasto din Fabrică cu Telecomandă",
        "name_it": "Riscaldamento Ausiliario Webasto con Telecomando",
        "rarity_tier": "UNICORN",
        "market_premium_eur": 2400,
        "keywords": [
            "webasto", "auxiliary heater", "standheizung", "fjärrstyrd dieselvärmare",
            "dieselvärmare", "bränslevärmare", "motorvärmare fjärr", "värmare med fjärr",
            "incalzire auxiliara", "riscaldamento autonomo"
        ]
    },
    "9M1": {
        "brand": "VAG",
        "category": "CLIMATE",
        "name_en": "Auxiliary Heater without Remote Control (Timer/App)",
        "name_ro": "Încălzire Auxiliară cu Temporizator / App",
        "name_it": "Riscaldamento Ausiliario con Timer / App",
        "rarity_tier": "RARE",
        "market_premium_eur": 1500,
        "keywords": ["standheizung mit timer", "bränslevärmare med tidur", "dieselvärmare tidur"]
    },
    # ACOUSTICS / GLASS
    "VW6": {
        "brand": "VAG",
        "category": "ACOUSTICS",
        "name_en": "Acoustic Double Glazed Heat & Sound Insulating Glass",
        "name_ro": "Geamuri Duble Atermice Izolate Fonic și Termic",
        "name_it": "Vetri Doppi Insonorizzati e Termoisolanti",
        "rarity_tier": "UNICORN",
        "market_premium_eur": 1800,
        "keywords": [
            "akustikrutor", "laminerade rutor", "dubbelglas", "akustikverglasung",
            "doppelverglasung", "dämmglas", "acoustic glass", "double glazed",
            "insulated glass", "geamuri duble", "vetri doppi"
        ]
    },
    "VW5": {
        "brand": "VAG",
        "category": "ACOUSTICS",
        "name_en": "Heat-Insulating & Acoustic Windscreen & Side Windows",
        "name_ro": "Parbriz și Geamuri Laterale Atermice Insonorizate",
        "name_it": "Parabrezza e Vetri Laterali Insonorizzanti",
        "rarity_tier": "RARE",
        "market_premium_eur": 1200,
        "keywords": ["ljudisolerande rutor", "acoustic windshield"]
    },
    # CHASSIS / AIR SUSPENSION
    "1BK": {
        "brand": "PORSCHE",
        "category": "CHASSIS",
        "name_en": "Adaptive Air Suspension with PASM Level Control",
        "name_ro": "Suspensie Pneumatică Adaptivă PASM cu Reglaj Înălțime",
        "name_it": "Sospensioni Pneumatiche Adattive con PASM",
        "rarity_tier": "VERY_RARE",
        "market_premium_eur": 3200,
        "keywords": [
            "luftfjädring", "pasm", "adaptive air suspension", "air suspension",
            "luftfederung", "suspensie pneumatica", "perne de aer", "sospensioni ad aria",
            "luftfjädring inkl pasm"
        ]
    },
    "1BY": {
        "brand": "AUDI",
        "category": "CHASSIS",
        "name_en": "Audi Adaptive Air Suspension (Allroad Specific Range)",
        "name_ro": "Suspensie Pneumatică Adaptivă Audi Allroad",
        "name_it": "Sospensioni Pneumatiche Adattive Audi Allroad",
        "rarity_tier": "VERY_RARE",
        "market_premium_eur": 2800,
        "keywords": [
            "adaptive air suspension allroad", "audi luftfjädring", "adaptiv luftfjädring"
        ]
    },
    "0N5": {
        "brand": "VAG",
        "category": "CHASSIS",
        "name_en": "All-Wheel Steering (Rear-Axle Steering)",
        "name_ro": "Direcție Integrală 4 Roti (Punte Spate Viratoare)",
        "name_it": "Asse Posteriore Sterzante (Quattro Ruote Sterzanti)",
        "rarity_tier": "UNICORN",
        "market_premium_eur": 2500,
        "keywords": [
            "fyrhjulsstyrning", "bakhjulsstyrning", "rear-axle steering",
            "all-wheel steering", "hinterachslenkung", "allradlenkung", "punte spate viratoare"
        ]
    },
    # SEATS / COMFORT
    "4D3": {
        "brand": "VAG",
        "category": "INTERIOR",
        "name_en": "Front Seat Ventilation with Active Cooling",
        "name_ro": "Ventilație Activă Scaune Față",
        "name_it": "Ventilazione Attiva Sedili Anteriori",
        "rarity_tier": "RARE",
        "market_premium_eur": 1400,
        "keywords": [
            "ventilerade säten", "sätesventilation", "seat ventilation", "ventilated seats",
            "sitzbelüftung", "scaune ventilate", "ventilazione sedili"
        ]
    },
    "4D5": {
        "brand": "VAG",
        "category": "INTERIOR",
        "name_en": "Front Seat Ventilation & Massage Function",
        "name_ro": "Ventilație și Masaj Scaune Față",
        "name_it": "Ventilazione e Massaggio Sedili Anteriori",
        "rarity_tier": "VERY_RARE",
        "market_premium_eur": 2200,
        "keywords": [
            "massage fram", "massage säten", "massagesitze", "massage seats",
            "ventilatie si masaj"
        ]
    },
    "Q1J": {
        "brand": "PORSCHE",
        "category": "INTERIOR",
        "name_en": "18-Way Adaptive Sports Seats Plus with Memory",
        "name_ro": "Scaune Sport Adaptive Reglaj 18 Direcții cu Memorie",
        "name_it": "Sedili Sportivi Adattivi a 18 Vie con Pacchetto Memoria",
        "rarity_tier": "RARE",
        "market_premium_eur": 2100,
        "keywords": [
            "18-vägs sportstolar", "18-vägs", "adaptiva sportstolar 18",
            "18-way sports seats", "18-wege sportsitze"
        ]
    },
    # ROOF
    "3FU": {
        "brand": "VAG",
        "category": "INTERIOR",
        "name_en": "Panoramic Sliding Glass Roof System",
        "name_ro": "Plafon Panoramic Glisant din Sticlă",
        "name_it": "Tetto Panoramico Apribile in Vetro",
        "rarity_tier": "RARE",
        "market_premium_eur": 1900,
        "keywords": [
            "panoramatak", "panoramasoltak", "panoramaglastak", "panoramic roof",
            "panoramic glass sunroof", "panoramadach", "plafon panoramic", "tetto panoramico"
        ]
    },
    # DRIVER ASSIST / RADAR
    "8T3": {
        "brand": "VAG",
        "category": "SAFETY",
        "name_en": "Adaptive Cruise Control (ACC) with Radar & Stop&Go",
        "name_ro": "Pilot Automat Adaptiv (ACC Radar cu Funcție Stop&Go)",
        "name_it": "Cruise Control Adattivo (ACC Radar con Stop&Go)",
        "rarity_tier": "STANDARD",
        "market_premium_eur": 1300,
        "keywords": [
            "adaptiv farthållare", "acc", "adaptive cruise control", "abstandsregeltempomat",
            "distronic", "pilot automat adaptiv"
        ]
    },
    "KS1": {
        "brand": "VAG",
        "category": "TECH",
        "name_en": "Head-Up Display (Virtual Windscreen Projection)",
        "name_ro": "Head-Up Display (Proiecție Laser pe Parbriz)",
        "name_it": "Head-Up Display (Proiezione su Parabrezza)",
        "rarity_tier": "RARE",
        "market_premium_eur": 1600,
        "keywords": [
            "head-up display", "head up display", "hud", "vindrutevisning"
        ]
    },
    "KA6": {
        "brand": "VAG",
        "category": "TECH",
        "name_en": "360° Surround View Cameras (ParkAssist with Area View)",
        "name_ro": "Camere 360° Surround View (Vedere Perimetrică)",
        "name_it": "Telecamere 360° Surround View (Vista a 360 Gradi)",
        "rarity_tier": "RARE",
        "market_premium_eur": 1400,
        "keywords": [
            "360 kamera", "surround view", "backkamera 360", "omgivningskamera",
            "360-graders kamera", "area view", "360 camera"
        ]
    },
    # LIGHTS
    "8IT": {
        "brand": "PORSCHE",
        "category": "LIGHTS",
        "name_en": "LED Main Headlights with PDLS+ (Porsche Dynamic Light System)",
        "name_ro": "Faruri LED cu PDLS+ (Porsche Dynamic Light System Plus)",
        "name_it": "Fari Principali a LED con PDLS+",
        "rarity_tier": "RARE",
        "market_premium_eur": 1800,
        "keywords": [
            "pdls+", "pdls plus", "porsche dynamic light system", "matrix led",
            "led matrix", "matrix-strålkastare", "audi matrix"
        ]
    },
    # TOWBAR
    "1D3": {
        "brand": "VAG",
        "category": "UTILITY",
        "name_en": "Electric Retractable Trailer Hitch / Towbar",
        "name_ro": "Cârlig de Remorcare Retractabil Electric din Buton",
        "name_it": "Gancio di Traino Retrattile Elettricamente",
        "rarity_tier": "RARE",
        "market_premium_eur": 1500,
        "keywords": [
            "dragkrok infällbar", "elektrisk dragkrok", "infällbar dragkrok",
            "dragkrok (elutfällbar)", "anhängevorrichtung anklappbar", "carlig remorcare electric",
            "trailer hitch electric", "gancio traino elettrico"
        ]
    },
    # AUDIO
    "9VL": {
        "brand": "PORSCHE",
        "category": "AUDIO",
        "name_en": "BOSE® Surround Sound System",
        "name_ro": "Sistem Audio Premium BOSE® Surround",
        "name_it": "Sistema Audio Surround BOSE®",
        "rarity_tier": "RARE",
        "market_premium_eur": 1600,
        "keywords": ["bose", "bose surround", "bose ljudsystem", "bose sound system"]
    },
    "9VJ": {
        "brand": "PORSCHE",
        "category": "AUDIO",
        "name_en": "Burmester® High-End 3D Surround Sound System",
        "name_ro": "Sistem Audio Audiophile Burmester® High-End 3D",
        "name_it": "Burmester® High-End 3D Surround Sound System",
        "rarity_tier": "UNICORN",
        "market_premium_eur": 4500,
        "keywords": ["burmester", "burmester high-end", "burmester 3d"]
    },
    # PERFORMANCE
    "QR5": {
        "brand": "PORSCHE",
        "category": "PERFORMANCE",
        "name_en": "Sport Chrono Package with Mode Switch on Steering Wheel",
        "name_ro": "Pachet Sport Chrono cu Selector Mod Conducere pe Volan",
        "name_it": "Pacchetto Sport Chrono con Selettore Modalità sul Volante",
        "rarity_tier": "VERY_RARE",
        "market_premium_eur": 2200,
        "keywords": [
            "sport chrono", "sport chrono-paket", "sport chrono paket",
            "mode switch", "launch control"
        ]
    },
    "0P9": {
        "brand": "PORSCHE",
        "category": "PERFORMANCE",
        "name_en": "Sports Exhaust System with Active Sound Flaps",
        "name_ro": "Sistem de Evacuare Sport cu Clapete Active",
        "name_it": "Impianto di Scarico Sportivo con Valvole Attive",
        "rarity_tier": "RARE",
        "market_premium_eur": 2400,
        "keywords": [
            "sportavgassystem", "sportavgas", "sports exhaust", "sportabgasanlage",
            "evacuare sport"
        ]
    }
}


class PRDecoder:
    """Intelligent PR Code and equipment parser for automotive listings."""

    @staticmethod
    def get_catalog() -> Dict[str, Dict[str, Any]]:
        """Return the complete PR code definitions."""
        return PR_CATALOG

    @staticmethod
    def decode_code(code: str) -> Optional[Dict[str, Any]]:
        """Return metadata for a single PR code."""
        code_upper = code.strip().upper()
        return PR_CATALOG.get(code_upper)

    @staticmethod
    def extract_from_text(text: str, brand: str = "VAG") -> List[Dict[str, Any]]:
        """
        Analyze Swedish, German, or English listing text or equipment specs.
        Returns matching PR codes, matched phrases, and calculated premiums.
        """
        if not text:
            return []

        text_lower = text.lower()
        matched = []
        already_added = set()

        for code, data in PR_CATALOG.items():
            # If explicit PR code is found in text (e.g., 'PR: 9M9' or 'Code 1BK')
            direct_pattern = rf"\b{re.escape(code)}\b"
            direct_match = re.search(direct_pattern, text, re.IGNORECASE)

            # Check semantic keywords
            keyword_match = False
            matched_word = None
            for kw in data.get("keywords", []):
                # Substring match for Swedish compound words
                if kw in text_lower:
                    keyword_match = True
                    matched_word = kw
                    break

            if (direct_match or keyword_match) and code not in already_added:
                already_added.add(code)
                matched.append({
                    "code": code,
                    "brand": data["brand"],
                    "category": data["category"],
                    "name_en": data["name_en"],
                    "name_ro": data["name_ro"],
                    "name_it": data["name_it"],
                    "rarity_tier": data["rarity_tier"],
                    "market_premium_eur": data["market_premium_eur"],
                    "matched_by": "direct_code" if direct_match else f"keyword: {matched_word}"
                })

        return matched

    @staticmethod
    def calculate_unicorn_score(pr_codes: List[str]) -> Dict[str, Any]:
        """
        Calculates a vehicle's Unicorn Rarity Score (0 to 100)
        and estimated total resale market premium across Continental Europe.
        """
        score = 0
        total_premium = 0
        tiers = []

        for c in pr_codes:
            info = PR_CATALOG.get(c.upper())
            if not info:
                continue

            tier = info.get("rarity_tier", "STANDARD")
            tiers.append(tier)
            total_premium += info.get("market_premium_eur", 0)

            if tier == "UNICORN":
                score += 35
            elif tier == "VERY_RARE":
                score += 25
            elif tier == "RARE":
                score += 15
            else:
                score += 5

        # Check Holy Grail Nordic combo: Webasto (9M9) + Double Glazing (VW6) + Air Suspension (1BK)
        is_holy_grail = ("9M9" in pr_codes and "VW6" in pr_codes) or ("9M9" in pr_codes and "1BK" in pr_codes)
        if is_holy_grail:
            score = max(score, 90)

        capped_score = min(score, 100)

        return {
            "score": capped_score,
            "is_unicorn": capped_score >= 60,
            "is_holy_grail": is_holy_grail,
            "total_option_premium_eur": total_premium,
            "classified_tier": "HOLY_GRAIL" if is_holy_grail else ("UNICORN" if capped_score >= 60 else "HIGH_SPEC")
        }


if __name__ == "__main__":
    sample_text = """
    PORSCHE MACAN S DIESEL 258HK 2017
    Svensksåld med full servicebok.
    Utrustad med: Luftfjädring inkl PASM (1BK), Fjärrstyrd dieselvärmare Webasto (9M9),
    Panoramatak öppningsbart, Ventilerade säten fram med kyla, Dragkrok infällbar el,
    Akustikrutor laminerade dubbelglas, Adaptiv farthållare ACC radar, Backkamera 360,
    BOSE Surround Sound System, Sport Chrono-paket med körlägesväljare på ratten.
    """

    results = PRDecoder.extract_from_text(sample_text)
    codes = [r["code"] for r in results]
    evaluation = PRDecoder.calculate_unicorn_score(codes)

    print(f"Detected {len(results)} PR codes:")
    for r in results:
        print(f" - [{r['code']}] {r['name_en']} (Rarity: {r['rarity_tier']}, +{r['market_premium_eur']}EUR)")

    print(f"\nUnicorn Score: {evaluation['score']}/100 | Tier: {evaluation['classified_tier']}")
    print(f"Total Option Premium: +{evaluation['total_option_premium_eur']} EUR")
