# AppScript-Gemini-Rename-Folder-PDFs
This script renames PDFs in a Drive folder using Gemini API. It analyzes PDF content to generate descriptive filenames with a YYYY-MM-DD date prefix, extracting key document details. Respects API rate limits.

# Gemini PDF Renamer

This Google Apps Script automates the renaming of PDF files in a Google Drive folder using the Gemini API. It analyzes the content of the PDFs to generate descriptive filenames that start with a date prefix (YYYY-MM-DD), followed by key information extracted from the document.

## How it Works

The script iterates through all PDF files in a specified Google Drive folder, analyzes their content using the Gemini API, and renames them accordingly. The new filenames include a date and relevant information from the document.

## Prerequisites

* A Google account with access to Google Drive and Google Apps Script.
* A Google Cloud Platform (GCP) project with access enabled for the Gemini API.
* A Gemini API key.
* The ID of the Google Drive folder containing the PDFs to be renamed.

## Setup

1.  **Find the Google Drive Folder ID:**
    * Open your Google Drive folder in a web browser.
    * The folder ID is the part of the URL after `folders/`. For example, if the URL is `https://drive.google.com/drive/folders/1abc2def3ghi4jkl5mno`, then the folder ID is `1abc2def3ghi4jkl5mno`.

2.  **Create a Gemini API Key:**
    * Go to the [Google Cloud Console](https://console.cloud.google.com/).
    * Create a new project or select an existing one.
    * Enable the Gemini API for your project.
    * Go to "APIs & Services" -> "Credentials".
    * Click "Create Credentials" -> "API key".
    * Note your API key.

3.  **Set up Google Apps Script:**
    * Open Google Drive and create a new Google Apps Script (New -> More -> Google Apps Script).
    * Copy the content of the `GeminiPdfRenamer.gs` file into the script editor.
    * Replace `YOUR_FOLDER_ID` with your Google Drive folder ID.
    * Replace `YOUR_API_KEY` with your Gemini API key.
    * Save the script (File -> Save).

4.  **Set up a Trigger:**
    * In the script editor, click the clock icon ("Triggers").
    * Click "Add Trigger".
    * Select `GeminiRename` as the function to run.
    * Select "Time-driven" as the event source.
    * Choose the desired time interval (e.g., "Minutes timer" and then "Every 5 minutes").
    * Click "Save".

## Variables

* `folderId`: The ID of the Google Drive folder containing the PDF files.
* `folder`: The Google Drive folder object retrieved by the `folderId`.
* `files`: An iterator list of files in the folder.
* `lastCallTime`: Stores the timestamp of the last API call to respect rate limits.
* `file`: The current file object being processed.
* `fileName`: The original filename of the current file.
* `pdfBlob`: The content of the PDF file as a blob.
* `now`: The current timestamp.
* `geminiResponse`: The response from the Gemini API containing the new filename.
* `newFileName`: The generated new filename.
* `API_KEY`: Your Gemini API key.
* `API_URL`: The URL of the Gemini API.
* `base64Pdf`: The Base64-encoded content of the PDF file.
* `payload`: The request sent to the Gemini API.
* `options`: The options for the API call.
* `response`: The response from the Gemini API.
* `jsonResponse`: The JSON response from the Gemini API.

## Important Notes

* Ensure the Gemini API is enabled in your GCP project.
* Be mindful of the Gemini API rate limits and adjust the trigger schedule accordingly.
* The Gemini API is a paid service. Be aware of the costs associated with using the API.
* The script only renames PDF files that do not already start with a date in the format YYYY-MM-DD.
* It is important to use the correct formatting for binary data. Base64 encoding is a good solution.

## Error Handling

The script logs errors in the Google Apps Script logs if issues occur with the API call or if the API returns an unexpected response.
