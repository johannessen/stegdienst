// UTF-8

if (! window.config) { window.config = {}; }
config.printAction = "cgi-bin/stegdienst.cgi";
window.params = {};
params.history = {};



config.markWeekDay = 3;  // Team-Wechsel: mittwochs
config.targetYear = "2019 (Testdaten)";  // Jahr für Termine Stegauf-/abbau
config.summerStart = { month: 3, day: 16 };  // Termin Stegaufbau
config.summerEnd = { month: 10, day: 5 };  // Termin Stegabbau



// remote: true = fern, false = nah
// board: true  = Vorstandsmitglied
// exempt: true = befreit vom Stegdienst
// avoidMax: true = möglichst nicht häufiger als andere einteilen

params.members = [

{ name: "Adam Alfa", remote: false, exempt: true },
{ name: "Britta Bravo", remote: true },
{ name: "Christa Charlie", remote: true, avoidMax: true },
{ name: "Dieter Delta", remote: true },
{ name: "Emil Echo", remote: false },
{ name: "Frida Foxtrot", remote: true, board: true },
{ name: "Gerhart Golf", remote: true },
{ name: "Helmut Hotel", remote: false },
{ name: "Ingmar India", remote: false },
{ name: "Julie Juliett", remote: true },
{ name: "Karoline Kilo", remote: false, board: true },
{ name: "Ludwig Lima", remote: false, board: true },
{ name: "Martina Mike", remote: true },
{ name: "Nora November", remote: false },
{ name: "Oskar Oscar", remote: false, avoidMax: true },
{ name: "Pippa Papa", remote: true, avoidMax: true },
{ name: "Qādir Quebec", remote: false },
{ name: "Rebekka Romeo", remote: true },
{ name: "Samira Sierra", remote: false, board: true },
{ name: "Timmy Tango", remote: true },
{ name: "Ulrike Uniform", remote: true },
{ name: "Veronika Victor", remote: false },
{ name: "Wladimir Whiskey", remote: true, board: true },
{ name: "Xander X. Ray", remote: true },
{ name: "Yasmin Yankee", remote: false },
{ name: "Zoë Zulu", remote: true },

];



params.history["Test"] = "\
Frida Foxtrot	Christa Charlie	\n\
Helmut Hotel	Karoline Kilo	\n\
Martina Mike	Julie Juliett	\n\
Oskar Oscar	Nora November	\n\
Pippa Papa	Adam Alfa	\n\
Ingmar India	Gerhart Golf	\n\
Britta Bravo	Ludwig Lima	\n\
Emil Echo	Dieter Delta	\n\
nobody	Pippa Papa	\n\
Ludwig Lima	Oskar Oscar	\n\
Nora November	Dieter Delta	\n\
Gerhart Golf	Emil Echo	\n\
Karoline Kilo	Helmut Hotel	\n\
Christa Charlie	Britta Bravo	\n\
Pippa Papa	Martina Mike	\n\
Oskar Oscar	nobody	\n\
Julie Juliett	Adam Alfa	\n\
Ingmar India	Christa Charlie	\n\
";

params.history["2018"] = "\
";
