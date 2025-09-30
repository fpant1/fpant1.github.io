---
layout: page
title: Automated Job Application Tracker
description: Using automation tools and AI to streamline job application tracking.
img: assets/img/jobtracker.png
importance: 1
category: work
related_publications: true
---

Keeping track of multiple job applications across different platforms can quickly get messy.  
To solve this, I built an **automated pipeline** that reads emails from my inbox, classifies them using AI, and logs structured updates into a Google Sheet.  

The system automatically identifies whether an email is:  
- A **new application** confirmation  
- An **update** (such as an interview invite, rejection, or task assignment)  
- Or just **other** (newsletters, job alerts, unrelated messages)  

Once classified, the automation updates the spreadsheet with the company, role, current status, interview dates, and any additional notes.

---

## Flow Overview  

Here’s the high-level flow of the process:  

1. **Email Intake** → Emails are fetched from my personal mailbox.  
2. **AI Classification** → Gemini analyses the content and returns structured JSON (category, company, role, status, interview details).  
3. **Data Logging** → The relevant row in the Google Sheet is created/updated automatically.  
4. **Visual Tracking** → The spreadsheet becomes a live dashboard of all my applications.  

---

## Development Snapshots  


<div class="pswp-gallery pswp-gallery--single-column" id="gallery--job-tracker">
  <a href="{{ 'assets/img/jobflow.png' | relative_url }}"
    data-pswp-width="1920"
    data-pswp-height="1080"
    target="_blank">
    <img src="{{ 'assets/img/jobflow.png' | relative_url }}" alt="Automation flow diagram" />
  </a>

  <a href="{{ 'assets/img/jobspreadsheet.png' | relative_url }}"
    data-pswp-width="1920"
    data-pswp-height="1080"
    target="_blank">
    <img src="{{ 'assets/img/jobspreadsheet.png' | relative_url }}" alt="Spreadsheet tracking output" />
  </a>
</div>

<div class="caption">
    Left: flow diagram of the automation. Right: the structured Google Sheet used for tracking application status.  
</div>

---

## Reuse the Automation  

If you’d like to adapt this process for your own job search, you can import my workflow JSON directly:  

<a href="{{ 'assets/json/job-tracker.json' | relative_url }}" target="_blank" rel="noopener noreferrer" class="json-link">
  <i class="fa-solid fa-file-code"></i> Download automation JSON
</a>


This file contains the setup I used to classify emails and connect the data pipeline. You can customise it to your own needs by editing the classification prompt or adjusting the spreadsheet schema.  

---
