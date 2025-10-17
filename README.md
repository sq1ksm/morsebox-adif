# MorseBOX ADIF Exporter - HELP

**Web tool for exporting logs from MorseBOX to ADIF format**

## Features
- ✅ **Load MorseBOX log files** (supports version 7.02 .txt files)
- ✅ **Automatic log parsing** - extracts date, time, callsign, name and RST report
- ✅ **Duplicate filtering** - removes same callsign duplicates within 2 minutes
- ✅ **Data editing** - manually correct names, reports, and band information
- ✅ **Export to ADIF** - generates proper ADIF file for logging software
- ✅ **Delete entries** - remove unwanted QSOs before export

##  How to Use
1. **Enter your callsign** in the "Your callsign" field
2. **Load log file** from MorseBOX (.txt)
3. **Review and edit data** in the table:
   - Complete/correct names
   - Check sent/received reports
   - Enter band (in meters: 80, 20, 10...)
4. **Remove unwanted entries** using "Delete selected"
5. **Click "Export to ADIF"** to download `log.adi`

## Supported ADIF Fields
- `OPERATOR` - Your callsign
- `CALL` - Contacted station
- `QSO_DATE` - Date (YYYYMMDD)
- `TIME_ON` - Time (HHMM)
- `MODE` - Always CW
- `RST_SENT` - Sent report
- `RST_RCVD` - Received report
- `NAME` - Name (if available)
- `BAND` - Band (if provided)

## ⚠️ Important Note
*This tool is not an official MorseBOX component, but was developed in consultation with the MorseBOX author and has functional compatibility approval.*

## Requirements
- Modern web browser with JavaScript
- MorseBOX version 7.02 log files

---

# MorseBOX ADIF Exporter - POMOC (PL)

**Narzędzie webowe do eksportu logów z MorseBOX do formatu ADIF**

## Funkcjonalności
- ✅ **Wczytywanie plików logów MorseBOX** (obsługa plików .txt z wersji 7.02)
- ✅ **Automatyczne parsowanie** - wyodrębnia datę, czas, znak, imię i raport RST
- ✅ **Filtrowanie powtórzeń** - usuwa duplikaty tego samego znaku w ciągu 2 minut
- ✅ **Edycja danych** - ręczna korekta imion, raportów i pasma
- ✅ **Eksport do ADIF** - generuje plik ADIF dla programów logujących
- ✅ **Usuwanie wpisów** - usuwanie niechcianych QSO przed eksportem

## Jak używać
1. **Wpisz swój znak** w polu "Twój znak"
2. **Wczytaj plik logu** z MorseBOX (.txt)
3. **Sprawdź i popraw dane** w tabeli:
   - Uzupełnij/popraw imiona
   - Sprawdź raporty nadawane/odbierane
   - Wpisz pasmo (w metrach: 80, 20, 10...)
4. **Usuń niechciane wpisy** - "Usuń zaznaczone"
5. **Kliknij "Eksportuj do ADIF"** - pobierz `log.adi`

## Obsługiwane pola ADIF
- `OPERATOR` - Twój znak
- `CALL` - Znak stacji
- `QSO_DATE` - Data (YYYYMMDD)
- `TIME_ON` - Czas (HHMM)
- `MODE` - Zawsze CW
- `RST_SENT` - Raport nadawany
- `RST_RCVD` - Raport odbierany
- `NAME` - Imię (jeśli dostępne)
- `BAND` - Pasmo (jeśli podane)

## ⚠️ Ważna uwaga
*Narzędzie nie jest oficjalnym komponentem MorseBOX, ale zostało opracowane w konsultacji z autorem MorseBOX i ma zatwierdzoną zgodność funkcjonalną.*

## Wymagania
- Nowoczesna przeglądarka z JavaScript
- Pliki logów z MorseBOX wersja 7.02

---

*Open-source project under MIT license | Created by amateur radio community for MorseBOX users*
