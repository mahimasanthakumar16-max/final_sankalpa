/**
 * Google Apps Script for Sankalpa Counseling Web Integration
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Paste this code into the editor (replace default code).
 * 4. Replace the ADMIN_EMAIL below if needed.
 * 5. Click "Deploy" > "New deployment".
 * 6. Select type: "Web app".
 * 7. Set "Execute as": "Me".
 * 8. Set "Who has access": "Anyone".
 * 9. Click "Deploy", authorize the permissions, and copy the Web App URL.
 * 10. Add the Web App URL to your .env.local file as: GOOGLE_APPS_SCRIPT_URL="your-web-app-url"
 */

const ADMIN_EMAIL = "tsmahimatherapy@gmail.com";

function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const requestData = JSON.parse(jsonString);
    const { formType, data } = requestData;
    
    if (!formType || !data) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Missing formType or data" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheetName = "";
    
    // Map form types to Sheet Tab names
    switch(formType) {
      case "contact":
        sheetName = "Contact Messages";
        break;
      case "bookings":
        sheetName = "Consultation Bookings";
        break;
      case "service_inquiry":
        sheetName = "Service Inquiries";
        break;
      case "group_counseling":
        sheetName = "Group Counseling Interest";
        break;
      case "newsletter":
        sheetName = "Newsletter Subscriptions";
        break;
      default:
        sheetName = formType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }
    
    let targetSheet = sheet.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!targetSheet) {
      targetSheet = sheet.insertSheet(sheetName);
    }
    
    // Read existing headers
    let headers = [];
    if (targetSheet.getLastColumn() > 0) {
      headers = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];
    }
    
    // Generate/update headers dynamically based on incoming key-value pairs
    if (headers.length === 0) {
      headers = ["Timestamp", ...Object.keys(data).map(key => formatHeader(key))];
      targetSheet.appendRow(headers);
      
      // Style headers
      const headerRange = targetSheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackgroundColor("#1e293b"); // Slate 800
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("left");
      targetSheet.setFrozenRows(1);
    } else {
      // Check if new fields exist in data that aren't headers yet
      let headersModified = false;
      Object.keys(data).forEach(key => {
        const formattedHeader = formatHeader(key);
        if (headers.indexOf(formattedHeader) === -1) {
          headers.push(formattedHeader);
          headersModified = true;
        }
      });
      
      if (headersModified) {
        // Rewrite header row with new columns
        targetSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // Re-style headers
        const headerRange = targetSheet.getRange(1, 1, 1, headers.length);
        headerRange.setFontWeight("bold");
        headerRange.setBackgroundColor("#1e293b");
        headerRange.setFontColor("#ffffff");
        headerRange.setHorizontalAlignment("left");
      }
    }
    
    // Build row values aligned to header names
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    
    const rowValues = headers.map(headerName => {
      if (headerName === "Timestamp") return formattedDate;
      
      // Match the header to incoming data keys
      const matchingKey = Object.keys(data).find(key => formatHeader(key) === headerName);
      return matchingKey !== undefined ? data[matchingKey] : "";
    });
    
    targetSheet.appendRow(rowValues);
    
    // Auto-fit columns
    const lastColumn = targetSheet.getLastColumn();
    for (let col = 1; col <= lastColumn; col++) {
      targetSheet.autoResizeColumn(col);
    }
    
    // Send automated email notifications
    sendEmails(formType, data);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error in doPost:", error);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Convert camelCase or snake_case keys into Title Case headers
function formatHeader(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

function sendEmails(formType, data) {
  const readableFormType = formType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const clientEmail = data.email || data.clientEmail || "";
  const clientName = data.fullName || data.clientName || data.name || "Client";
  
  // Custom theme styling settings based on form types
  let accentColor = "#0f766e"; // Teal (peaceful/default)
  let bannerColor = "#115e59";
  
  switch(formType) {
    case "bookings":
      accentColor = "#4f46e5"; // Indigo (professional/secure)
      bannerColor = "#3730a3";
      break;
    case "service_inquiry":
      accentColor = "#0d9488"; // Teal (caring/warm)
      bannerColor = "#115e59";
      break;
    case "group_counseling":
      accentColor = "#c2410c"; // Terracotta (social/community)
      bannerColor = "#9a3412";
      break;
    case "newsletter":
      accentColor = "#0284c7"; // Sky Blue (communication)
      bannerColor = "#0369a1";
      break;
  }

  // Common Header/Footer components for templates
  const mailHeader = `
    <div style="font-family: 'Outfit', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, ${accentColor}, ${bannerColor}); padding: 35px 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Sankalpa Counseling</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; font-weight: 600; letter-spacing: 1.5px;">Reflections, Grounding & Healing</p>
      </div>
  `;

  const mailFooter = `
      <div style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; line-height: 1.5;">
        <p style="margin: 0 0 4px 0; font-weight: 600; color: #334155;">Sankalpa Counseling Services</p>
        <p style="margin: 0 0 10px 0;">Warm, inclusive, and trauma-informed psychotherapeutic support.</p>
        <div style="margin-top: 12px; font-size: 12px; opacity: 0.85;">
          This is an automated notification. Please do not reply directly to this email.
        </div>
      </div>
    </div>
  `;

  // 1. DYNAMIC ADMIN EMAIL
  let adminTableRows = "";
  Object.entries(data).forEach(([key, value]) => {
    const keyLabel = formatHeader(key);
    const valText = value ? value.toString().replace(/\n/g, '<br>') : '<em>Not provided</em>';
    adminTableRows += `
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #f1f5f9; font-weight: 600; font-size: 14px; color: #475569; background-color: #f8fafc; width: 35%;">${keyLabel}</td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; line-height: 1.5;">${valText}</td>
      </tr>
    `;
  });

  const htmlBodyAdmin = `
    ${mailHeader}
      <div style="padding: 35px 30px; color: #334155; line-height: 1.6;">
        <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #0f172a;">New Form Submission Alert</h2>
        <p style="font-size: 15px; margin: 0 0 20px 0;">Hello Mahima, you have received a new web submission for <strong>${readableFormType}</strong>. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 10px;">
          ${adminTableRows}
        </table>
      </div>
    ${mailFooter}
  `;

  // Dispatch email to Admin
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Website Alert] New ${readableFormType} Submission`,
    htmlBody: htmlBodyAdmin,
    replyTo: clientEmail || undefined
  });

  // 2. CLIENT ACKNOWLEDGEMENT EMAIL
  if (clientEmail) {
    let clientSubject = "";
    let htmlContentClient = "";

    switch(formType) {
      case "contact":
        clientSubject = "We have received your message - Sankalpa Counseling";
        htmlContentClient = `
          <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #0f172a; font-weight: 600;">Hello ${clientName},</h2>
          <p style="font-size: 15px; margin: 0 0 15px 0; color: #334155;">Thank you for reaching out to Sankalpa Counseling.</p>
          <p style="font-size: 15px; margin: 0 0 15px 0; color: #334155;">We have successfully received your message regarding: <strong>${data.service || 'General Counseling'}</strong>.</p>
          <p style="font-size: 15px; margin: 0 0 25px 0; color: #334155;">Please know that all contact is confidential. I review submissions personally and will get back to you within 48 to 72 business hours.</p>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 25px;">
            <p style="margin: 0; font-size: 15px; color: #334155;">Warm regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: ${accentColor}; font-size: 16px;">Mahima Tirunelveli Santhakumar</p>
            <p style="margin: 1px 0 0 0; font-size: 13px; color: #64748b;">Counselor & Therapist | Sankalpa Counseling</p>
          </div>
        `;
        break;
        
      case "bookings":
        clientSubject = "Confirmation: Your Consultation Booking - Sankalpa Counseling";
        htmlContentClient = `
          <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #0f172a; font-weight: 600;">Dear ${clientName},</h2>
          <p style="font-size: 15px; margin: 0 0 15px 0; color: #334155;">Your free initial consultation has been booked successfully! Here are the session details for your reference:</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid ${accentColor}; border-radius: 6px; padding: 20px; margin: 20px 0; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #475569; font-weight: 600; width: 30%;">Date:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${data.preferredDate}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #475569; font-weight: 600;">Time:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${data.preferredTime}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #475569; font-weight: 600;">Format:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${data.sessionType}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 15px; margin: 0 0 25px 0; color: #334155;">I will reach out to you with the secure video meeting link or contact details before our scheduled time. If you need to make changes, please let me know at least 24 hours in advance.</p>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 25px;">
            <p style="margin: 0; font-size: 15px; color: #334155;">Warm regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: ${accentColor}; font-size: 16px;">Mahima Tirunelveli Santhakumar</p>
            <p style="margin: 1px 0 0 0; font-size: 13px; color: #64748b;">Counselor & Therapist | Sankalpa Counseling</p>
          </div>
        `;
        break;
        
      case "service_inquiry":
        clientSubject = "Service Inquiry Details - Sankalpa Counseling";
        htmlContentClient = `
          <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #0f172a; font-weight: 600;">Hello ${clientName},</h2>
          <p style="font-size: 15px; margin: 0 0 15px 0; color: #334155;">Thank you for your interest in counseling services.</p>
          <p style="font-size: 15px; margin: 0 0 15px 0; color: #334155;">I have successfully received your inquiry regarding: <strong>${data.service || 'Individual Therapy'}</strong>.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid ${accentColor}; border-radius: 6px; padding: 20px; margin: 20px 0; font-size: 14.5px; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
            <p style="margin: 0 0 8px 0; color: #334155;"><strong>Therapy Concern:</strong> ${data.concern || 'Not specified'}</p>
            <p style="margin: 0 0 8px 0; color: #334155;"><strong>Preferred Contact Method:</strong> ${data.contactMethod ? data.contactMethod.toUpperCase() : 'EMAIL'}</p>
            <p style="margin: 0; color: #334155;"><strong>Preferred Call Time:</strong> ${data.preferredTime || 'Flexible'}</p>
          </div>
          
          <p style="font-size: 15px; margin: 0 0 25px 0; color: #334155;">I will review your concerns and preferences, and will contact you via your preferred choice within 24 to 48 business hours to discuss session availability.</p>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 25px;">
            <p style="margin: 0; font-size: 15px; color: #334155;">Warm regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: ${accentColor}; font-size: 16px;">Mahima Tirunelveli Santhakumar</p>
            <p style="margin: 1px 0 0 0; font-size: 13px; color: #64748b;">Counselor & Therapist | Sankalpa Counseling</p>
          </div>
        `;
        break;
        
      case "group_counseling":
        clientSubject = "Group Therapy Waitlist Registered - Sankalpa Counseling";
        htmlContentClient = `
          <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #0f172a; font-weight: 600;">Dear ${clientName},</h2>
          <p style="font-size: 15px; margin: 0 0 15px 0; color: #334155;">Thank you for your interest in our upcoming Group Counseling offerings.</p>
          <p style="font-size: 15px; margin: 0 0 15px 0; color: #334155;">We have successfully registered your name and interest in our waitlist. We will notify you as soon as new support groups or group sessions become available matching your preferences.</p>
          <p style="font-size: 15px; margin: 0 0 25px 0; color: #334155;">If you have any questions or would like to transition to individual therapy, please feel free to reach out via our contact page.</p>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 25px;">
            <p style="margin: 0; font-size: 15px; color: #334155;">Warm regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: ${accentColor}; font-size: 16px;">Mahima Tirunelveli Santhakumar</p>
            <p style="margin: 1px 0 0 0; font-size: 13px; color: #64748b;">Counselor & Therapist | Sankalpa Counseling</p>
          </div>
        `;
        break;
        
      case "newsletter":
        clientSubject = "Welcome to the Sankalpa Newsletter!";
        htmlContentClient = `
          <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #0f172a; font-weight: 600;">Welcome,</h2>
          <p style="font-size: 15px; margin: 0 0 15px 0; color: #334155;">Your email has been subscribed to the Sankalpa Counseling newsletter.</p>
          <p style="font-size: 15px; margin: 0 0 25px 0; color: #334155;">You will now receive periodic reflections, self-care resources, mental health tips, and notifications regarding upcoming therapeutic workshops.</p>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 25px;">
            <p style="margin: 0; font-size: 15px; color: #334155;">Warm regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: ${accentColor}; font-size: 16px;">Mahima Tirunelveli Santhakumar</p>
            <p style="margin: 1px 0 0 0; font-size: 13px; color: #64748b;">Counselor & Therapist | Sankalpa Counseling</p>
          </div>
        `;
        break;
    }

    const htmlBodyClient = `
      ${mailHeader}
        <div style="padding: 35px 30px; color: #334155; line-height: 1.6;">
          ${htmlContentClient}
        </div>
      ${mailFooter}
    `;

    // Dispatch email to User
    MailApp.sendEmail({
      to: clientEmail,
      subject: clientSubject,
      htmlBody: htmlBodyClient
    });
  }
}
