/**
 * Helper to forward form submissions to Google Apps Script Web App
 */
export async function forwardToAppsScript(formType: string, data: Record<string, any>) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) {
    console.warn('GOOGLE_APPS_SCRIPT_URL is not configured. Skipping Google Sheets integration.');
    return null;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType,
        data,
      }),
    });

    if (!response.ok) {
      console.error(`Apps Script response error: ${response.status} ${response.statusText}`);
      return false;
    }

    // Google Apps Script might return plain text or HTML redirect in some modes, 
    // but our script is designed to return JSON. Let's parse it safely.
    const text = await response.text();
    try {
      const resData = JSON.parse(text);
      if (!resData.success) {
        console.error('Apps Script integration failed:', resData.error);
        return false;
      }
      return true;
    } catch (parseError) {
      // In case Apps Script redirects or returns non-JSON, but still succeeded
      console.log('Apps Script response parsed as text:', text);
      return true;
    }
  } catch (error) {
    console.error('Failed to forward to Apps Script:', error);
    return false;
  }
}
