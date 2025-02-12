/**
 * GeminiRename
 *
 * Dieses Skript automatisiert die Umbenennung von PDF-Dateien in einem angegebenen Google Drive-Ordner.
 * Es verwendet die Gemini API, um den Inhalt jeder PDF-Datei zu analysieren und einen beschreibenden Dateinamen zu generieren.
 * Der neue Dateiname beginnt mit einem Datumspräfix im Format YYYY-MM-DD, gefolgt von Schlüsselinformationen aus dem Dokument.
 * Das Skript berücksichtigt die Ratenbegrenzungen der API und behandelt potenzielle Fehler während des Prozesses.
 */
function GeminiRename() {
  // Ersetzen Sie 'YOUR_FOLDER_ID' durch die tatsächliche ID Ihres Google Drive-Ordners.
  var folderId = 'YOUR_FOLDER_ID';
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles(); // Ruft die Liste aller Dateien im angegebenen Ordner ab.
  var lastCallTime = 0; // Speichert den Zeitstempel des letzten API-Aufrufs, um Ratenbegrenzungen einzuhalten.

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();

    // Überprüft, ob die Datei eine PDF-Datei ist und ob der Dateiname nicht bereits mit einem Datum im Format YYYY-MM-DD beginnt.
    if (fileName.toLowerCase().endsWith('.pdf') && !/^\d{4}-\d{2}-\d{2}([^_]|$)/.test(fileName)) {

      var pdfBlob = file.getBlob(); // Ruft den Inhalt der PDF-Datei als Blob ab.

      // Überprüft, ob seit dem letzten API-Aufruf mindestens 30 Sekunden vergangen sind, um Ratenbegrenzungen einzuhalten.
      var now = Date.now();
      if (now - lastCallTime < 30000) {
        Utilities.sleep(30000 - (now - lastCallTime)); // Pausiert das Skript für die verbleibende Zeit.
      }

      // Ruft den neuen Dateinamen von der Gemini API ab.
      var geminiResponse = getGeminiFilename(pdfBlob, fileName);
      lastCallTime = Date.now(); // Aktualisiert den Zeitstempel des letzten API-Aufrufs.

      if (geminiResponse) {
        var newFileName = geminiResponse + '.pdf';
        file.setName(newFileName); // Benennt die Datei mit dem neuen Namen um.
      } else {
        Logger.log("Gemini API-Aufruf fehlgeschlagen oder kein Dateiname erhalten.");
      }
    }
  }
}

/**
 * getGeminiFilename
 *
 * Sendet eine PDF-Datei an die Gemini API, um einen beschreibenden Dateinamen zu generieren.
 *
 * @param {Blob} pdfBlob - Der Inhalt der PDF-Datei als Blob.
 * @param {string} fileName - Der ursprüngliche Dateiname.
 * @returns {string|null} - Der generierte Dateiname oder null bei einem Fehler.
 */
function getGeminiFilename(pdfBlob, fileName) {
  // Ersetzen Sie 'YOUR_API_KEY' durch Ihren tatsächlichen Gemini API-Schlüssel.
  var API_KEY = 'YOUR_API_KEY';
  var API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + API_KEY;

  // Konvertiert den PDF-Blob in eine Base64-kodierte Zeichenkette, die an die API gesendet werden kann.
  var base64Pdf = Utilities.base64Encode(pdfBlob.getBytes());

  // Erstellt die Anfrage für die Gemini API.
  var payload = {
    contents: [{
      parts: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Pdf
          }
        },
        { text: "Basierend auf dem Inhalt dieser PDF, gib mir einen Dateinamen der mit YYYY-MM-DD beginnt und die wichtigsten Infos der datei enthaelt. Der Zeitstempel am Anfang YYYY-MM-DD soll das Eingangsdatum des Dokuments sein. Gib mir nur den Namen aus den ich direkt uebernehmen kann. Nimm dinge die im Dokument vorkommen wie der absender - bestell oder vorgangsnummer - der betreff oder andere wichtige details. Nutze Leerzeichen als Trenner nach dem Datumsstempel am Anfang und keine bindestriche und keine unterstriche. Scrheibe Waehrungen als Buchstaben wie z b EUR oder USD ohne Symbole. Verwende keine Sonderzeichen. Keine weitere ausgabe - nur der Name" }
      ]
    }]
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  try {
    // Sendet die Anfrage an die Gemini API und verarbeitet die Antwort.
    var response = UrlFetchApp.fetch(API_URL, options);
    var jsonResponse = JSON.parse(response.getContentText());

    // Extrahiert den generierten Dateinamen aus der API-Antwort.
    if (jsonResponse.candidates && jsonResponse.candidates[0].content && jsonResponse.candidates[0].content.parts && jsonResponse.candidates[0].content.parts[0].text) {
      return jsonResponse.candidates[0].content.parts[0].text.trim();
    } else {
      Logger.log("Unerwartete Gemini-Antwort: " + JSON.stringify(jsonResponse));
      return null;
    }

  } catch (e) {
    // Protokolliert Fehler, die während des API-Aufrufs auftreten.
    Logger.log("Fehler beim Aufruf der Gemini API: " + e.toString());
    return null;
  }
}
