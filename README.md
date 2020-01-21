Stegdienstliste erzeugen
========================

Diese Anwendung soll die Erzeugung von Stegdienstlisten in der [Segel-
und Kanugemeinschaft Brucher Talsperre (SKGB)][1] unterstützen. Sie war
ursprünglich als Bestandteil von [SKGB-intern][2] gedacht.

Zum Stegdienst werden nach bestimmten [Kriterien][3] Mitglieder für jede
Saison im Voraus wochenweise eingeteilt, um nach dem Rechten zu sehen
und andere Routineaufgaben rund um das Vereinsgelände durchzuführen.

[1]: https://www.skgb.de/
[2]: https://intern.skgb.de/
[3]: https://github.com/skgb/stegdienst/wiki/Merkblatt-Stegdienstliste


Funktionalität
--------------

- Automatische Berechnung von Stegdienstlisten-Entwürfen anhand
  auswählbarer Strategien (u. a. Monte-Carlo-Optimierung)

- Interaktive Benutzerschnittstelle zur effizienten Bearbeitung von
  Stegdienstlisten-Entwürfen

- Automatische Bewertung von Entwürfen anhand von Kriterien/Traditionen
  des Vereins (z. B. „nah/fern“)

- Direkte Ausgabe von Stegdienstlisten als LibreOffice-Datei (zur freien
  Nachbearbeitung und PDF-Umwandlung)

- Lauffähig wahlweise auf einem Server mit Anbindung an eine
  Online-Mitgliederdatenbank oder offline als reine
  HTML/JavaScript-Anwendung
  (Ausnahme: die LibreOffice-Ausgabe erfordert einen CGI-Server)


Demo
----

Als Demonstration ist derzeit die jeweils aktuelle Entwicklungsversion
samt Fantasie-Daten via GitHub Pages öffentlich zugänglich:

https://johannessen.github.io/stegdienst/stegdienst.html

Zur Ausgabe als LibreOffice-Datei muss ein CGI-Dienst verfügbar sein.
Diese Funktion ist also nur verfügbar, wenn die Anwendung auf einem
Web-Server installiert wird, der CGI unterstützt. Für GitHub Pages ist
dies nicht der Fall; in der Demo ist deshalb die LibreOffice-Ausgabe
nicht funktionsfähig.


Installation
------------

### Offline-Installation

1. Download
2. `stegdienst-data.js` von Quellen im Verein besorgen oder manuell
   erzeugen (Format analog zu `lib/demo-data.js`)
3. `stegdienst.html` in beliebigem Web-Browser öffnen (z. B. Firefox)

### Server-Installation

1. Webserver mit CGI-Unterstützung (z. B. Apache mit `mod_cgi`)
2. Perl mit `Mojolicious`
3. `git clone`
4. Skript in `cgi-bin` ausführbar machen
5. ggf. Template im CGI-Skript an Corporate Design anpassen
6. ggf. Pfad `config.printAction` an das CGI-Skript anpassen
7. Inhalt von `stegdienst-data.js` automatisiert aus der
   Mitgliederdatenbank erzeugen lassen
   (Format analog zu `lib/demo-data.js`)
8. alle Dateien im Web bereitstellen, jedoch vor unberechtigtem Zugriff
   schützen (Datenschutz)


Copyright
---------

(c) 2010–2020 [Arne Johannessen](https://arne.johannessen.de/)

Dies ist freie Software, weiterverwendbar unter den Bedingungen der
[ISC-Lizenz](https://github.com/johannessen/stegdienst/blob/master/LICENSE.txt).
