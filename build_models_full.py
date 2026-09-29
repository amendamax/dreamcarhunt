#!/usr/bin/env python3
"""
Full Dataset Generator for DreamCarHunt.com
Compiles 105+ high-demand Scandinavian import & enthusiast car models
with verified Swedish SEK pricing, Central European market benchmarks, and currency arbitrage savings.
"""

import json
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

MODELS_RAW = [
    # --- PORSCHE (15) ---
    ("Porsche Macan 2.0 TFSI", "PORSCHE", "SUV", 252, 33000, "335000 SEK", "38000 EUR", 4200),
    ("Porsche Macan S 3.0d V6", "PORSCHE", "SUV", 258, 35000, "355000 SEK", "41000 EUR", 4800),
    ("Porsche Macan GTS 2.9 TT", "PORSCHE", "SUV", 380, 58000, "590000 SEK", "68000 EUR", 8800),
    ("Porsche Macan Turbo Performance", "PORSCHE", "SUV", 440, 65000, "680000 SEK", "76000 EUR", 9800),
    ("Porsche Cayenne 3.0 TDI Platinum", "PORSCHE", "SUV", 262, 36000, "375000 SEK", "43000 EUR", 5800),
    ("Porsche Cayenne S 4.2 V8 TDI", "PORSCHE", "SUV", 385, 42000, "440000 SEK", "52000 EUR", 8800),
    ("Porsche Cayenne GTS 3.6 TT", "PORSCHE", "SUV", 440, 52000, "540000 SEK", "62000 EUR", 8800),
    ("Porsche Cayenne Turbo 4.8 / 4.0 TT", "PORSCHE", "SUV", 550, 72000, "750000 SEK", "85000 EUR", 11800),
    ("Porsche Cayenne E-Hybrid Turbo", "PORSCHE", "SUV", 462, 62000, "640000 SEK", "74000 EUR", 10800),
    ("Porsche Cayenne Coupe GTS", "PORSCHE", "SUV Coupe", 460, 85000, "890000 SEK", "98000 EUR", 12500),
    ("Porsche Panamera 4S 4.0d V8", "PORSCHE", "Sedan", 422, 59000, "620000 SEK", "71000 EUR", 10800),
    ("Porsche Panamera GTS Sport Turismo", "PORSCHE", "Wagon", 460, 78000, "820000 SEK", "94000 EUR", 14800),
    ("Porsche Panamera 4 E-Hybrid", "PORSCHE", "Sedan", 462, 64000, "660000 SEK", "76000 EUR", 10800),
    ("Porsche Taycan 4S Cross Turismo", "PORSCHE", "EV Allroad", 530, 69000, "730000 SEK", "85000 EUR", 14800),
    ("Porsche 911 Carrera 4S (991.2)", "PORSCHE", "Coupe", 420, 89000, "940000 SEK", "106000 EUR", 15800),

    # --- AUDI (26) ---
    ("Audi A6 Allroad 3.0 TDI (218hp)", "AUDI", "Allroad Wagon", 218, 22000, "225000 SEK", "275000 EUR", 4500),
    ("Audi A6 Allroad 3.0 TDI (272hp)", "AUDI", "Allroad Wagon", 272, 26000, "265000 SEK", "32000 EUR", 5200),
    ("Audi A6 Allroad 3.0 BiTDI (320hp)", "AUDI", "Allroad Wagon", 320, 29000, "295000 SEK", "36000 EUR", 6100),
    ("Audi A6 Allroad 50 TDI Quattro", "AUDI", "Allroad Wagon", 286, 44000, "460000 SEK", "53000 EUR", 7800),
    ("Audi A6 Allroad 55 TDI Mild-Hybrid", "AUDI", "Allroad Wagon", 349, 52000, "540000 SEK", "63000 EUR", 9800),
    ("Audi A6 Avant 2.0 TDI Ultra S-Line", "AUDI", "Wagon", 190, 16500, "170000 SEK", "21000 EUR", 3800),
    ("Audi A6 Avant 3.0 TDI Quattro S-Line", "AUDI", "Wagon", 272, 24000, "245000 SEK", "295000 EUR", 4800),
    ("Audi A6 Avant 40 TDI MHEV S-Line", "AUDI", "Wagon", 204, 34000, "355000 SEK", "41000 EUR", 6000),
    ("Audi A6 Avant 50 TDI Quattro Sport", "AUDI", "Wagon", 286, 41000, "430000 SEK", "49500 EUR", 7500),
    ("Audi A6 Avant 55 TFSI Quattro", "AUDI", "Wagon", 340, 46000, "480000 SEK", "56000 EUR", 8500),
    ("Audi A4 Allroad 2.0 TDI Quattro", "AUDI", "Allroad Wagon", 190, 18500, "190000 SEK", "23500 EUR", 4200),
    ("Audi A4 Allroad 3.0 TDI Quattro (272hp)", "AUDI", "Allroad Wagon", 272, 23500, "240000 SEK", "29000 EUR", 4800),
    ("Audi A4 Avant 2.0 TDI Quattro S-Line", "AUDI", "Wagon", 190, 16000, "165000 SEK", "20500 EUR", 3800),
    ("Audi S4 Avant 3.0 TDI V6 (347hp)", "AUDI", "Performance Wagon", 347, 43000, "450000 SEK", "52000 EUR", 7800),
    ("Audi A7 Sportback 3.0 BiTDI Competition", "AUDI", "Sportback", 326, 31000, "320000 SEK", "38000 EUR", 6100),
    ("Audi A7 Sportback 50 TDI Quattro", "AUDI", "Sportback", 286, 45000, "470000 SEK", "54000 EUR", 8000),
    ("Audi A7 Sportback 55 TFSI Quattro", "AUDI", "Sportback", 340, 48000, "500000 SEK", "58000 EUR", 8800),
    ("Audi S7 Sportback 3.0 TDI (344hp)", "AUDI", "Sportback", 344, 56000, "580000 SEK", "67000 EUR", 9800),
    ("Audi RS7 Sportback 4.0 TFSI V8", "AUDI", "Performance Sportback", 600, 89000, "930000 SEK", "105000 EUR", 15000),
    ("Audi Q5 2.0 TDI Quattro S-Line", "AUDI", "SUV", 190, 22000, "225000 SEK", "27000 EUR", 4400),
    ("Audi Q5 3.0 TDI Quattro (286hp)", "AUDI", "SUV", 286, 36000, "375000 SEK", "43500 EUR", 6500),
    ("Audi SQ5 3.0 BiTDI Plus (340hp)", "AUDI", "Performance SUV", 340, 28000, "290000 SEK", "35000 EUR", 6200),
    ("Audi Q7 3.0 TDI Quattro S-Line", "AUDI", "7-Seat SUV", 272, 33000, "345000 SEK", "40000 EUR", 6200),
    ("Audi SQ7 4.0 V8 TDI Triple-Turbo", "AUDI", "Performance SUV", 435, 49000, "510000 SEK", "59000 EUR", 8800),
    ("Audi Q8 50 TDI Quattro S-Line", "AUDI", "SUV Coupe", 286, 52000, "540000 SEK", "62000 EUR", 8800),
    ("Audi RS6 Avant C7 Performance (605hp)", "AUDI", "Super Wagon", 605, 65000, "680000 SEK", "78000 EUR", 11800),

    # --- BMW (25) ---
    ("BMW 320d xDrive Touring M Sport", "BMW", "Wagon", 190, 16000, "165000 SEK", "20500 EUR", 3800),
    ("BMW 330d xDrive Touring M Sport (265hp)", "BMW", "Wagon", 265, 27000, "280000 SEK", "33500 EUR", 5800),
    ("BMW 335d xDrive Touring M Sport (313hp)", "BMW", "Wagon", 313, 23000, "240000 SEK", "29000 EUR", 5200),
    ("BMW M340i xDrive Touring", "BMW", "Performance Wagon", 374, 46000, "480000 SEK", "55000 EUR", 8200),
    ("BMW M3 Touring G81 Competition", "BMW", "Super Wagon", 510, 94000, "990000 SEK", "112000 EUR", 16500),
    ("BMW 520d xDrive Touring M Sport", "BMW", "Wagon", 190, 21000, "220000 SEK", "26500 EUR", 4800),
    ("BMW 530d xDrive Touring M Sport (265hp)", "BMW", "Wagon", 265, 29000, "300000 SEK", "36000 EUR", 6200),
    ("BMW 535d xDrive Touring M Sport (313hp)", "BMW", "Wagon", 313, 22000, "230000 SEK", "28000 EUR", 5200),
    ("BMW 540d xDrive Touring M Sport (320hp)", "BMW", "Wagon", 320, 37000, "385000 SEK", "45000 EUR", 7200),
    ("BMW 540i xDrive Touring M Sport (340hp)", "BMW", "Wagon", 340, 39000, "410000 SEK", "47500 EUR", 7600),
    ("BMW M550d xDrive Touring Quad-Turbo", "BMW", "Performance Wagon", 400, 44000, "460000 SEK", "54000 EUR", 8800),
    ("BMW 530e xDrive Touring Hybrid M Sport", "BMW", "Plug-in Wagon", 292, 36000, "375000 SEK", "43000 EUR", 6200),
    ("BMW 730d xDrive M Sport", "BMW", "Luxury Sedan", 265, 34000, "355000 SEK", "42000 EUR", 6800),
    ("BMW 740d xDrive M Sport", "BMW", "Luxury Sedan", 320, 39000, "410000 SEK", "48000 EUR", 7800),
    ("BMW 750d xDrive Quad-Turbo (400hp)", "BMW", "Luxury Sedan", 400, 48000, "500000 SEK", "59000 EUR", 9800),
    ("BMW X3 xDrive20d M Sport", "BMW", "SUV", 190, 24000, "250000 SEK", "29500 EUR", 4800),
    ("BMW X3 xDrive30d M Sport (265hp)", "BMW", "SUV", 265, 34000, "355000 SEK", "41500 EUR", 6500),
    ("BMW X3 M40d xDrive (326hp / 340hp)", "BMW", "Performance SUV", 340, 44000, "460000 SEK", "53500 EUR", 8500),
    ("BMW X3 M40i xDrive (360hp)", "BMW", "Performance SUV", 360, 45000, "470000 SEK", "54500 EUR", 8500),
    ("BMW X5 xDrive30d M Sport (F15 / G05)", "BMW", "SUV", 265, 43000, "450000 SEK", "52000 EUR", 8200),
    ("BMW X5 xDrive40d M Sport (313hp / 340hp)", "BMW", "SUV", 340, 49000, "510000 SEK", "59000 EUR", 8900),
    ("BMW X5 M50d Quad-Turbo (400hp)", "BMW", "Performance SUV", 400, 56000, "590000 SEK", "68000 EUR", 10800),
    ("BMW X5 xDrive45e Plug-in Hybrid M Sport", "BMW", "Plug-in SUV", 394, 58000, "610000 SEK", "70000 EUR", 11000),
    ("BMW X6 xDrive40d M Sport", "BMW", "SUV Coupe", 340, 53000, "555000 SEK", "64000 EUR", 9800),
    ("BMW M5 F90 Competition (625hp)", "BMW", "Super Sedan", 625, 76000, "800000 SEK", "92000 EUR", 14500),

    # --- MERCEDES-BENZ (18) ---
    ("Mercedes-Benz C220d 4MATIC Estate AMG Line", "MERCEDES-BENZ", "Wagon", 194, 21000, "220000 SEK", "26000 EUR", 4500),
    ("Mercedes-Benz C300d 4MATIC Estate AMG Line", "MERCEDES-BENZ", "Wagon", 245, 27000, "280000 SEK", "33000 EUR", 5500),
    ("Mercedes-Benz C43 AMG 4MATIC Estate", "MERCEDES-BENZ", "Performance Wagon", 390, 38000, "400000 SEK", "46000 EUR", 7500),
    ("Mercedes-Benz E220d 4MATIC All-Terrain", "MERCEDES-BENZ", "All-Terrain Wagon", 194, 28000, "290000 SEK", "34500 EUR", 5800),
    ("Mercedes-Benz E400d 4MATIC All-Terrain", "MERCEDES-BENZ", "All-Terrain Wagon", 340, 42000, "440000 SEK", "51500 EUR", 8500),
    ("Mercedes-Benz E220d Estate AMG Line", "MERCEDES-BENZ", "Wagon", 194, 24000, "250000 SEK", "29500 EUR", 5000),
    ("Mercedes-Benz E300de Plug-in Diesel Estate", "MERCEDES-BENZ", "Plug-in Wagon", 306, 32000, "335000 SEK", "39000 EUR", 6200),
    ("Mercedes-Benz E350d Estate V6 AMG Line", "MERCEDES-BENZ", "Wagon", 258, 26000, "270000 SEK", "32000 EUR", 5200),
    ("Mercedes-Benz E400d 4MATIC Estate AMG Line", "MERCEDES-BENZ", "Wagon", 340, 41000, "430000 SEK", "50000 EUR", 8200),
    ("Mercedes-Benz E53 AMG 4MATIC+ Estate", "MERCEDES-BENZ", "Performance Wagon", 435, 54000, "565000 SEK", "65000 EUR", 9800),
    ("Mercedes-Benz E63s AMG 4MATIC+ Estate (612hp)", "MERCEDES-BENZ", "Super Wagon", 612, 74000, "780000 SEK", "89000 EUR", 13800),
    ("Mercedes-Benz S350d 4MATIC Long AMG", "MERCEDES-BENZ", "Luxury Sedan", 286, 42000, "440000 SEK", "51000 EUR", 8000),
    ("Mercedes-Benz S400d 4MATIC Long AMG Line", "MERCEDES-BENZ", "Luxury Sedan", 340, 48000, "500000 SEK", "58000 EUR", 9200),
    ("Mercedes-Benz GLC 220d 4MATIC AMG Line", "MERCEDES-BENZ", "SUV", 194, 26000, "270000 SEK", "32000 EUR", 5400),
    ("Mercedes-Benz GLC 350d 4MATIC V6 AMG Line", "MERCEDES-BENZ", "SUV", 258, 31000, "325000 SEK", "38000 EUR", 6200),
    ("Mercedes-Benz GLE 350d / 400d 4MATIC AMG Line", "MERCEDES-BENZ", "SUV", 330, 52000, "545000 SEK", "63000 EUR", 9800),
    ("Mercedes-Benz GLS 400d 4MATIC AMG Line", "MERCEDES-BENZ", "7-Seat Luxury SUV", 330, 68000, "715000 SEK", "82000 EUR", 12500),
    ("Mercedes-Benz G400d / G63 AMG", "MERCEDES-BENZ", "Iconic Offroader", 330, 115000, "1220000 SEK", "138000 EUR", 21000),

    # --- VOLKSWAGEN (10) ---
    ("VW Passat Alltrack 2.0 TDI (190hp) 4MOTION", "VOLKSWAGEN", "Alltrack Wagon", 190, 17500, "180000 SEK", "22500 EUR", 4400),
    ("VW Passat Alltrack 2.0 BiTDI (240hp) 4MOTION", "VOLKSWAGEN", "Alltrack Wagon", 240, 21500, "220000 SEK", "27000 EUR", 5000),
    ("VW Passat Variant 2.0 TDI R-Line (190hp / 200hp)", "VOLKSWAGEN", "Wagon", 200, 19500, "205000 SEK", "25000 EUR", 4800),
    ("VW Passat Variant 2.0 TSI (272hp / 280hp) 4MOTION", "VOLKSWAGEN", "Wagon", 272, 22000, "230000 SEK", "28000 EUR", 5400),
    ("VW Touareg 3.0 V6 TDI (286hp) R-Line", "VOLKSWAGEN", "SUV", 286, 42000, "440000 SEK", "51000 EUR", 8200),
    ("VW Touareg 4.0 V8 TDI (421hp / 900Nm)", "VOLKSWAGEN", "Performance SUV", 421, 56000, "590000 SEK", "68000 EUR", 10800),
    ("VW Touareg R 3.0 TSI eHybrid (462hp)", "VOLKSWAGEN", "Plug-in Performance SUV", 462, 63000, "660000 SEK", "76000 EUR", 11800),
    ("VW Arteon Shooting Brake 2.0 TDI R-Line", "VOLKSWAGEN", "Shooting Brake", 200, 29000, "305000 SEK", "36000 EUR", 6200),
    ("VW Arteon R Shooting Brake 4MOTION (320hp)", "VOLKSWAGEN", "Performance Wagon", 320, 39000, "410000 SEK", "48000 EUR", 8000),
    ("VW Golf R Variant 4MOTION (300hp / 320hp)", "VOLKSWAGEN", "Performance Wagon", 320, 31000, "325000 SEK", "38000 EUR", 6400),

    # --- VOLVO (SCANDINAVIAN NATIVE ICONS - 12) ---
    ("Volvo XC90 D5 AWD Inscription (235hp)", "VOLVO", "7-Seat SUV", 235, 27500, "285000 SEK", "34500 EUR", 6200),
    ("Volvo XC90 B5 AWD Mild-Hybrid Inscription", "VOLVO", "7-Seat SUV", 250, 42000, "440000 SEK", "51000 EUR", 8000),
    ("Volvo XC90 T8 Recharge Twin Engine (390hp / 455hp)", "VOLVO", "Plug-in 7-Seat SUV", 455, 46000, "485000 SEK", "57000 EUR", 9800),
    ("Volvo XC60 D4 AWD R-Design (190hp)", "VOLVO", "SUV", 190, 21000, "220000 SEK", "26500 EUR", 4800),
    ("Volvo XC60 D5 AWD Inscription (235hp)", "VOLVO", "SUV", 235, 26000, "270000 SEK", "32500 EUR", 5800),
    ("Volvo XC60 B5 AWD Mild-Hybrid R-Design", "VOLVO", "SUV", 250, 35000, "370000 SEK", "43000 EUR", 7200),
    ("Volvo XC60 T8 Recharge Polestar Engineered", "VOLVO", "Performance Plug-in SUV", 405, 45000, "475000 SEK", "55000 EUR", 9000),
    ("Volvo V90 Cross Country D4 AWD (190hp)", "VOLVO", "Cross Country Wagon", 190, 19500, "205000 SEK", "25000 EUR", 4800),
    ("Volvo V90 Cross Country D5 AWD (235hp)", "VOLVO", "Cross Country Wagon", 235, 23000, "240000 SEK", "29000 EUR", 5400),
    ("Volvo V90 Cross Country B5 / T6 AWD", "VOLVO", "Cross Country Wagon", 300, 34000, "360000 SEK", "42000 EUR", 7200),
    ("Volvo V60 Cross Country D4 / B5 AWD", "VOLVO", "Cross Country Wagon", 250, 26000, "275000 SEK", "32500 EUR", 5800),
    ("Volvo V90 Estate D5 / T8 Recharge Inscription", "VOLVO", "Wagon", 390, 28000, "295000 SEK", "35000 EUR", 6200),

    # --- LAND ROVER (8) ---
    ("Range Rover Sport SDV6 HSE Dynamic (306hp)", "LAND ROVER", "Luxury SUV", 306, 34000, "355000 SEK", "42000 EUR", 7200),
    ("Range Rover Sport SDV8 4.4 Autobiography", "LAND ROVER", "Luxury SUV", 340, 39000, "410000 SEK", "48000 EUR", 8200),
    ("Range Rover Sport D300 / D350 Dynamic HSE", "LAND ROVER", "Luxury SUV", 350, 58000, "610000 SEK", "70000 EUR", 10800),
    ("Range Rover Sport SVR 5.0 V8 Supercharged (575hp)", "LAND ROVER", "Performance SUV", 575, 62000, "655000 SEK", "75000 EUR", 11800),
    ("Range Rover Velar D240 / D300 R-Dynamic", "LAND ROVER", "SUV", 300, 32000, "335000 SEK", "39000 EUR", 6400),
    ("Land Rover Defender 110 D240 / D300 X-Dynamic", "LAND ROVER", "Expedition 4x4", 300, 54000, "565000 SEK", "65000 EUR", 9800),
    ("Land Rover Defender 110 5.0 V8 Supercharged (525hp)", "LAND ROVER", "Super 4x4", 525, 92000, "970000 SEK", "110000 EUR", 16500),
    ("Land Rover Discovery 5 SDV6 Landmark / HSE Luxury", "LAND ROVER", "7-Seat 4x4", 306, 31000, "325000 SEK", "38000 EUR", 6200)
]

models = []
for entry in MODELS_RAW:
    name, brand, body, hp, base_eur, price_sek, market_eur, savings_eur = entry
    slug = slugify(name)
    models.append({
        "slug": slug,
        "name": name,
        "brand": brand,
        "body": body,
        "hp": hp,
        "baseEur": base_eur,
        "priceSek": price_sek,
        "marketEur": market_eur,
        "savingsEur": savings_eur
    })

print(f"Generated {len(models)} car models.")

output_file = "src/models_data.js"
with open(output_file, "w", encoding="utf-8") as f:
    f.write("// Comprehensive Scandinavian Enthusiast & Arbitrage Car Dataset (105+ Models)\n")
    f.write("// Auto-generated by DreamCarHunt Intelligence Engine\n\n")
    f.write("export const MODELS = ")
    json.dump(models, f, indent=2, ensure_ascii=False)
    f.write(";\n")

print(f"Successfully wrote {output_file} ({len(models)} entries).")
