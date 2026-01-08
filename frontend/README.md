# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


ADIM 1: Kural Setinin Tanımlanması (The Rule Book)
Koda başlamadan önce, bilgisayara öğreteceğimiz "Müzik Teorisi" kurallarını kesinleştirelim. Raporunuzdaki hedeflere göre  kurallar şunlardır:

Gam Kuralı (Tonalite): Rastgelelik yok. Tüm notalar Re Dorian (D Dorian) gamından seçilecek. (Simetrik ve bilimsel tını).


Perde Kuralı (Pitch): Amino asitlerin hidrofobikliği oktavı belirler.

Hidrofobik (F, L, I, V) → Oktav 3 (Kalın/Bas)

Nötr/Polar (S, P, T) → Oktav 4 (Orta)

Hidrofilik (K, R, E) → Oktav 5 (Tiz/Parlak)

Ritim Kuralı (Duration): Molekül büyüklüğü süreyi belirler.

Küçük Molekül (G, A) → Kısa nota (1/16 - 0.25)

Büyük Molekül (W, Y) → Uzun nota (1/2 - 2.0)

Dinamik Kuralı (Velocity): GC Oranı tuşe şiddetini belirler. Bağlar ne kadar güçlüyse, vuruş o kadar serttir.

Yapısal Kural (Structure):


ATG (Start): D4 notası, çok yüksek ses (Velocity 120), "Crash" efekti.

TAG/TAA (Stop): Nota çalma. Rest (Es) koy.

ADIM 2: Python Kodu (Tam Entegrasyon)
Aşağıdaki kod bloğunu projenize kopyalayın. Bu kod, yukarıdaki tüm kuralları içeren "Akıllı Çevirici" modülüdür.

Python

from music21 import stream, note, scale, dynamics, meter
from Bio.Seq import Seq

# --- 1. MÜZİKAL HAVUZ (GAM) TANIMLAMA ---
# Raporunuzdaki "Bilimsel Veri Katmanı"na uygun, simetrik bir mod seçiyoruz.
# Re Dorian: D, E, F, G, A, B, C
DORIAN_SCALE = scale.DorianScale('D')
VALID_PITCHES = [str(p) for p in DORIAN_SCALE.getPitches('C3', 'C6')]

# --- 2. AMİNO ASİT ÖZELLİK HARİTASI (LOOKUP TABLE) ---
# Rapor Bölüm 1.3.1: Fizikokimyasal özelliklere dayalı eşleştirme
AA_MUSIC_MAP = {
    # GRUP 1: HİDROFOBİK (İçerde saklananlar) -> KALIN OKTAV (3)
    'F': {'base_note': 'D3', 'duration': 0.5},  # Phe
    'L': {'base_note': 'E3', 'duration': 0.5},  # Leu
    'I': {'base_note': 'F3', 'duration': 0.5},  # Ile
    'V': {'base_note': 'G3', 'duration': 0.5},  # Val
    
    # GRUP 2: HİDROFİLİK (Dışarıda, suyu sevenler) -> TİZ OKTAV (5)
    'K': {'base_note': 'E5', 'duration': 0.25}, # Lys (Hızlı/Enerjik)
    'R': {'base_note': 'F5', 'duration': 0.25}, # Arg
    'H': {'base_note': 'G5', 'duration': 0.5},  # His
    'D': {'base_note': 'A5', 'duration': 1.0},  # Asp (Uzun)
    'E': {'base_note': 'B5', 'duration': 1.0},  # Glu

    # GRUP 3: POLAR / NÖTR (Dengeleyiciler) -> ORTA OKTAV (4)
    'S': {'base_note': 'A3', 'duration': 0.5},  # Ser
    'P': {'base_note': 'B3', 'duration': 0.25}, # Pro (Kıvrım yapar -> Kısa nota)
    'T': {'base_note': 'C4', 'duration': 0.5},  # Thr
    'A': {'base_note': 'D4', 'duration': 0.5},  # Ala
    'G': {'base_note': 'E4', 'duration': 0.25}, # Gly
    
    # ÖZEL: START (Metiyonin)
    'M': {'base_note': 'D4', 'duration': 2.0},  # Vurgulu, uzun
    
    # BİLİNMEYENLER İÇİN DEFAULT
    'X': {'base_note': 'D4', 'duration': 0.5} 
}

# Standart Genetik Kod Tablosu (Manuel referans için)
CODON_TABLE = {
    'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
    'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
    'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
    'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
    'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S',
    'CCU': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
    'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
    'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
    'TAT': 'Y', 'TAC': 'Y', 'TAA': '*', 'TAG': '*',
    'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
    'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
    'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
    'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W',
    'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
    'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
    'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
}

def analyze_codon_musicality(codon):
    """
    Bir kodonu alır ve raporunuzdaki kurallara göre Nota Nesnesi (Note Object) döndürür.
    """
    # 1. Kodonu Amino Asite Çevir
    aa = CODON_TABLE.get(codon, 'X')
    
    # --- KURAL: YAPISAL OLAYLAR (START/STOP) ---
    # Rapor Bölüm 1.3.1 - Madde 1 ve 2
    if aa == '*': # STOP KODONU
        rest_note = note.Rest()
        rest_note.duration.quarterLength = 1.0
        # Yapısal Token Ekle (AI Eğitimi için)
        rest_note.addLyric("STOP_CADENCE") 
        return rest_note
    
    # 2. Özellikleri Al (Fizikokimyasal Katman)
    props = AA_MUSIC_MAP.get(aa, AA_MUSIC_MAP['X'])
    pitch_val = props['base_note']
    duration_val = props['duration']
    
    # 3. Müzik Nesnesini Oluştur
    n = note.Note(pitch_val)
    n.duration.quarterLength = duration_val
    
    # --- KURAL: DİNAMİK (GC ORANI) ---
    # Rapor: "Mikro dinamizm (velocity değişimleri)"
    gc_count = codon.count('G') + codon.count('C')
    # GC 0 ise: 60 (Soft), GC 3 ise: 105 (Fortissimo)
    velocity = 60 + (gc_count * 15)
    
    # --- KURAL: START VURGUSU ---
    if codon == 'ATG':
        velocity = 120 # Maksimum vurgu
        n.addLyric("START_THEME") # Token
        n.style.color = 'red' # Görselleştirme için
    else:
        # Normal notalara amino asit ismini yaz (Eğitim verisi etiketi)
        n.addLyric(f"{codon}-{aa}")

    n.volume.velocity = velocity
    
    return n

def process_dna_to_melody(dna_seq):
    """
    Tüm DNA dizisini işleyip bir Melodi Partisyonu (Stream) oluşturur.
    """
    melody_part = stream.Part()
    melody_part.id = "Exon Melody"
    melody_part.insert(0, instrument.Piano()) # Enstrüman seçimi
    
    current_offset = 0.0
    
    # 3'erli adım (Kodon okuma) - Reading Frame
    for i in range(0, len(dna_seq) - 2, 3):
        codon = dna_seq[i : i+3]
        
        # Analiz Fonksiyonunu Çağır
        musical_event = analyze_codon_musicality(codon)
        
        # Partisyona ekle
        melody_part.insert(current_offset, musical_event)
        
        # Zamanı ilerlet (Notanın süresi kadar)
        current_offset += musical_event.duration.quarterLength
        
    return melody_part