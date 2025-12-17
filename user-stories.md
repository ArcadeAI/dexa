# Dexa Prompt Library

> First-degree prompts for initiating multi-tool agent workflows
> Organized by Persona, Industry, and Use Case

---

## Table of Contents

1. [Customer Success](#1-customer-success)
2. [Engineering Leadership](#2-engineering-leadership)
3. [Finance & Operations](#3-finance--operations)
4. [Sales & Revenue](#4-sales--revenue)
5. [Human Resources](#5-human-resources)
6. [Product Management](#6-product-management)
7. [Security & Compliance](#7-security--compliance)
8. [Executive Leadership](#8-executive-leadership)
9. [Data & Analytics](#9-data--analytics)
10. [IT Operations](#10-it-operations)

---

## 1. Customer Success

### Incident Root Cause Analysis

| Field | Value |
|-------|-------|
| **Persona** | Customer Success Manager |
| **Industry** | Technology / SaaS |
| **User Story** | As a CSM, I need to quickly create RCA documents when customer-impacting incidents occur so I can communicate transparently and maintain trust. |
| **Tools Involved** | Slack, Datadog, Google Docs, Gmail |

**Prompt:**
> "A P0 incident just happened affecting Acme Corp. Can you go to the #incidents-prod Slack channel, find the details about the outage from the last 2 hours, pull the relevant error logs from Datadog for the payments service, create a root cause analysis document in Google Docs with a timeline and impact summary, and then email it to the engineering manager Sarah Chen for review before I send it to the customer?"

---

### Customer Health Report

| Field | Value |
|-------|-------|
| **Persona** | Customer Success Manager |
| **Industry** | Enterprise Software |
| **User Story** | As a CSM, I need to prepare for QBRs by gathering usage data, support history, and engagement metrics across systems. |
| **Tools Involved** | Salesforce, Zendesk, Mixpanel/Amplitude, Google Slides |

**Prompt:**
> "I have a QBR with Globex Industries next Tuesday. Can you pull their account details and renewal date from Salesforce, get their support ticket history from the last quarter from Zendesk, grab their product usage metrics from Mixpanel, and create a QBR presentation deck in Google Slides with health score trends and key recommendations?"

---

### Escalation Management

| Field | Value |
|-------|-------|
| **Persona** | Customer Success Manager |
| **Industry** | Financial Services |
| **User Story** | As a CSM, when a customer escalates, I need to quickly gather context and loop in the right people. |
| **Tools Involved** | Zendesk, Slack, Salesforce, Google Calendar |

**Prompt:**
> "We just got an escalation from Morgan Stanley - ticket #45892 in Zendesk. Can you summarize the ticket history, check their Salesforce account for contract value and renewal date, post a summary to #escalations in Slack tagging @support-leads, and schedule a 30-minute sync with the account team for tomorrow afternoon?"

---

## 2. Engineering Leadership

### Sprint Planning Intelligence

| Field | Value |
|-------|-------|
| **Persona** | Engineering Manager |
| **Industry** | Technology |
| **User Story** | As an EM, I need to prepare for sprint planning by understanding tech debt, bug backlog, and team velocity. |
| **Tools Involved** | Jira, GitHub, Confluence, Slack |

**Prompt:**
> "Sprint planning is tomorrow. Can you pull all open bugs and tech debt tickets from Jira for the platform team, check GitHub for any PRs that have been open more than 5 days, calculate our velocity from the last 3 sprints, and post a summary to #platform-engineering with recommendations for what we should prioritize this sprint?"

---

### Production Incident Response

| Field | Value |
|-------|-------|
| **Persona** | VP of Engineering |
| **Industry** | E-commerce |
| **User Story** | As VP Eng, when production goes down, I need real-time status and coordinated response. |
| **Tools Involved** | PagerDuty, Datadog, Slack, Statuspage, Google Docs |

**Prompt:**
> "Our checkout service is down. Can you check PagerDuty for who's on-call and make sure they're engaged, pull the last 30 minutes of error logs from Datadog for the checkout and payments services, create a war room in Slack called #incident-dec-16-checkout, post the current status to our Statuspage, and start an incident doc in Google Docs with the timeline?"

---

### Team Performance Review Prep

| Field | Value |
|-------|-------|
| **Persona** | Engineering Manager |
| **Industry** | Technology |
| **User Story** | As an EM, I need to prepare for performance reviews by gathering data on my team's contributions. |
| **Tools Involved** | GitHub, Jira, Lattice/Culture Amp, Google Docs |

**Prompt:**
> "Performance reviews are next week. For each engineer on my team - Alex, Jordan, and Sam - can you pull their GitHub commit history and PR reviews from Q4, summarize their completed Jira tickets and story points, check their peer feedback in Lattice, and create individual performance summary docs in our HR folder in Google Drive?"

---

## 3. Finance & Operations

### Monthly Operating Expense Analysis

| Field | Value |
|-------|-------|
| **Persona** | Chief Operating Officer |
| **Industry** | Enterprise |
| **User Story** | As COO, I need to analyze monthly operating expenses and share insights with my team. |
| **Tools Involved** | NetSuite, Google Sheets, Slack, Google Slides |

**Prompt:**
> "Can you pull this month's operating expenses from NetSuite broken down by department, compare it to our budget and last month's actuals, create an analysis in Google Sheets highlighting any variances over 10%, and post a summary with the key callouts to #finance-leadership in Slack? Also create a 3-slide executive summary I can present at tomorrow's ops review."

---

### Vendor Invoice Processing

| Field | Value |
|-------|-------|
| **Persona** | Finance Manager |
| **Industry** | Retail |
| **User Story** | As a Finance Manager, I need to reconcile vendor invoices against POs and flag discrepancies. |
| **Tools Involved** | Gmail, NetSuite, Google Sheets, Slack |

**Prompt:**
> "I have a bunch of vendor invoices in my inbox this week. Can you scan my Gmail for emails with PDF attachments from vendors, match them against open purchase orders in NetSuite, create a reconciliation spreadsheet in Google Sheets flagging any invoices that don't match or exceed the PO amount by more than 5%, and send me a Slack message with the ones that need my attention?"

---

### Revenue Recognition Report

| Field | Value |
|-------|-------|
| **Persona** | Controller |
| **Industry** | SaaS |
| **User Story** | As Controller, I need to prepare monthly revenue recognition reports for the board. |
| **Tools Involved** | Salesforce, Stripe, Google Sheets, Gmail |

**Prompt:**
> "Month-end close is tomorrow. Can you pull all closed-won deals from Salesforce for November, match them against actual payments received in Stripe, calculate the deferred vs recognized revenue based on our contract terms, put it all in our revenue rec template in Google Sheets, and email the draft to the CFO for review?"

---

## 4. Sales & Revenue

### Deal Preparation & Research

| Field | Value |
|-------|-------|
| **Persona** | Account Executive |
| **Industry** | Enterprise Software |
| **User Story** | As an AE, I need to prepare thoroughly for enterprise sales calls by gathering all relevant intel. |
| **Tools Involved** | LinkedIn, Salesforce, Google Search, Gong, Google Docs |

**Prompt:**
> "I have a call with the CTO of Acme Corp in 2 hours. Can you pull up their LinkedIn profile and recent posts, check Salesforce for our interaction history and any notes from previous calls, search for recent news about their company, find similar deals we've closed in their industry from Gong, and put together a one-page prep doc in Google Docs with talking points and potential objections?"

---

### Pipeline Review Preparation

| Field | Value |
|-------|-------|
| **Persona** | VP of Sales |
| **Industry** | Technology |
| **User Story** | As VP Sales, I need to prepare for weekly pipeline reviews with accurate, up-to-date data. |
| **Tools Involved** | Salesforce, Gong, Clari, Google Slides, Slack |

**Prompt:**
> "Pipeline review is at 2pm. Can you pull all deals in Stage 3+ from Salesforce, check Gong for which ones had calls this week and summarize the outcomes, get the AI forecast from Clari, flag any deals that have been in the same stage for more than 30 days, and create a pipeline review deck in Google Slides? Post it to #sales-leadership 30 minutes before the meeting."

---

### Lost Deal Analysis

| Field | Value |
|-------|-------|
| **Persona** | Sales Operations Manager |
| **Industry** | B2B SaaS |
| **User Story** | As Sales Ops, I need to analyze lost deals to identify patterns and improve win rates. |
| **Tools Involved** | Salesforce, Gong, Google Sheets, Slack |

**Prompt:**
> "Can you pull all closed-lost deals from Q4 in Salesforce, analyze the loss reasons, check Gong for the final calls on the top 10 by deal value and summarize what went wrong, create a loss analysis report in Google Sheets with trends by competitor, deal size, and industry, and post the key findings to #sales-ops?"

---

## 5. Human Resources

### New Hire Onboarding

| Field | Value |
|-------|-------|
| **Persona** | HR Manager |
| **Industry** | Technology |
| **User Story** | As HR, I need to ensure new hires have everything set up before their start date. |
| **Tools Involved** | Workday, Okta, Slack, Google Workspace, Jira |

**Prompt:**
> "Sarah Johnson starts on Monday as a Senior Engineer on the Platform team. Can you create her profile in Workday, provision her accounts in Okta with the standard engineering access groups, add her to the engineering Slack channels, set up her Google Workspace account, create an onboarding ticket in Jira for IT to ship her laptop, and send her manager Mike a checklist of what's been completed?"

---

### Employee Offboarding

| Field | Value |
|-------|-------|
| **Persona** | HR Business Partner |
| **Industry** | Enterprise |
| **User Story** | As HRBP, I need to ensure departing employees are properly offboarded across all systems. |
| **Tools Involved** | Workday, Okta, Google Workspace, Slack, Jira |

**Prompt:**
> "James Chen's last day is Friday. Can you initiate his termination workflow in Workday effective end of day Friday, schedule his Okta access to be revoked at 6pm PT that day, transfer ownership of his Google Drive files to his manager, remove him from all Slack channels, and create a Jira ticket for IT to collect his equipment? Send me a confirmation when it's all set up."

---

### PTO Balance Inquiry and Request

| Field | Value |
|-------|-------|
| **Persona** | Employee |
| **Industry** | Any |
| **User Story** | As an employee, I want to check my PTO balance and submit time off requests easily. |
| **Tools Involved** | Workday, Google Calendar, Slack |

**Prompt:**
> "Can you check how many vacation days I have left this year in Workday? If I have at least 5 days, submit a PTO request for December 23-27, block those dates on my Google Calendar, and let my manager know in Slack that I'll be out that week?"

---

## 6. Product Management

### Feature Launch Coordination

| Field | Value |
|-------|-------|
| **Persona** | Product Manager |
| **Industry** | SaaS |
| **User Story** | As a PM, I need to coordinate feature launches across engineering, marketing, and support. |
| **Tools Involved** | Jira, Slack, Notion, Gmail, Google Calendar |

**Prompt:**
> "We're launching the new dashboard feature next Tuesday. Can you check Jira to confirm all the tickets are marked done, update the release notes in Notion, post an announcement to #product-releases in Slack, email the support team the FAQ document, and schedule a launch retrospective meeting for Friday with the eng and design leads?"

---

### Customer Feedback Synthesis

| Field | Value |
|-------|-------|
| **Persona** | Product Manager |
| **Industry** | B2B Software |
| **User Story** | As a PM, I need to regularly synthesize customer feedback to inform roadmap decisions. |
| **Tools Involved** | Intercom, Zendesk, Gong, Productboard, Google Docs |

**Prompt:**
> "I'm preparing for our quarterly roadmap review. Can you pull all customer feedback from Intercom and Zendesk from the last 3 months tagged with 'feature-request', check Gong for any calls where customers mentioned our reporting capabilities, consolidate the top themes in Productboard, and create a customer insights summary doc in Google Docs with the top 5 requested features and their potential impact?"

---

### Competitive Intelligence

| Field | Value |
|-------|-------|
| **Persona** | Product Manager |
| **Industry** | Technology |
| **User Story** | As a PM, I need to stay informed about competitor moves and market trends. |
| **Tools Involved** | Google Search, LinkedIn, Slack, Notion |

**Prompt:**
> "Our competitor Acme just announced a new feature. Can you search for their announcement and any press coverage, check LinkedIn for reactions from industry analysts, look at what people are saying about it on Twitter, summarize the competitive implications, update our competitive intel page in Notion, and post a brief to #competitive-intel in Slack?"

---

## 7. Security & Compliance

### Security Incident Investigation

| Field | Value |
|-------|-------|
| **Persona** | Security Analyst |
| **Industry** | Financial Services |
| **User Story** | As a Security Analyst, I need to investigate potential security incidents and document findings. |
| **Tools Involved** | Splunk/Datadog, Okta, Jira, Slack, Google Docs |

**Prompt:**
> "We got an alert about suspicious login attempts for user john.doe@company.com. Can you pull the authentication logs from Okta for this user over the past 24 hours, check Splunk for any unusual API calls associated with their account, create a security incident ticket in Jira, post a preliminary assessment to #security-incidents in Slack, and start an investigation doc in Google Docs?"

---

### Compliance Audit Preparation

| Field | Value |
|-------|-------|
| **Persona** | Compliance Manager |
| **Industry** | Healthcare |
| **User Story** | As Compliance Manager, I need to gather evidence for our annual SOC 2 audit. |
| **Tools Involved** | Vanta/Drata, Google Drive, Jira, Slack |

**Prompt:**
> "Our SOC 2 auditors are coming next month. Can you pull the current compliance status from Vanta, identify any controls that are failing or need evidence, create a shared folder in Google Drive for audit evidence, generate Jira tickets for each item that needs remediation assigned to the appropriate team, and send a summary to #compliance with deadlines?"

---

### Access Review Campaign

| Field | Value |
|-------|-------|
| **Persona** | IT Security Manager |
| **Industry** | Enterprise |
| **User Story** | As IT Security Manager, I need to conduct quarterly access reviews to ensure least privilege. |
| **Tools Involved** | Okta, Sailpoint, Google Sheets, Slack, Gmail |

**Prompt:**
> "It's time for our quarterly access review. Can you pull the list of all users with admin access from Okta, cross-reference it with their current job titles and departments from Workday, flag anyone who has admin access but isn't in IT or Security, create a review spreadsheet in Google Sheets, send it to each department head via email asking them to confirm their team's access, and post a kickoff message to #it-security?"

---

## 8. Executive Leadership

### Board Meeting Preparation

| Field | Value |
|-------|-------|
| **Persona** | Chief Executive Officer |
| **Industry** | Startup |
| **User Story** | As CEO, I need to prepare comprehensive board materials with the latest metrics. |
| **Tools Involved** | Salesforce, Stripe, Google Sheets, Google Slides, Gmail |

**Prompt:**
> "Board meeting is Thursday. Can you pull our Q4 revenue and pipeline from Salesforce, get MRR and churn data from Stripe, update the financial model in Google Sheets with actuals, create the board deck in Google Slides using our standard template, and send a draft to the CFO and COO for review? Also remind me who's attending and when materials are due."

---

### All-Hands Meeting Prep

| Field | Value |
|-------|-------|
| **Persona** | Chief of Staff |
| **Industry** | Technology |
| **User Story** | As Chief of Staff, I need to prepare the CEO's all-hands presentation with company updates. |
| **Tools Involved** | Salesforce, Workday, Google Slides, Slack, Lattice |

**Prompt:**
> "All-hands is Friday. Can you pull our revenue numbers from Salesforce, headcount changes from Workday, recent wins from the #wins Slack channel, and employee engagement scores from Lattice? Create the all-hands deck in Google Slides with our wins, metrics, and new hire introductions. Post a reminder to #general that the all-hands is coming up."

---

### Investor Update

| Field | Value |
|-------|-------|
| **Persona** | CEO / CFO |
| **Industry** | Startup |
| **User Story** | As CEO, I need to send monthly investor updates with key metrics and highlights. |
| **Tools Involved** | Salesforce, Stripe, Google Docs, Gmail |

**Prompt:**
> "It's time for our monthly investor update. Can you pull this month's key metrics - ARR, net new customers, and churn from Stripe/Salesforce, summarize our top 3 wins and any challenges, draft the investor update email in our standard format in Google Docs, and send it to our investor distribution list once I approve it?"

---

## 9. Data & Analytics

### Ad-Hoc Analysis Request

| Field | Value |
|-------|-------|
| **Persona** | Data Analyst |
| **Industry** | E-commerce |
| **User Story** | As a Data Analyst, I need to quickly answer business questions with data from multiple sources. |
| **Tools Involved** | Snowflake, Google Sheets, Slack, Google Slides |

**Prompt:**
> "Marketing wants to know which customer segments had the highest LTV last quarter. Can you query our Snowflake warehouse for customer LTV by acquisition channel and cohort, create a visualization in Google Sheets showing the trends, put together a quick 2-slide summary in Google Slides with recommendations, and share it in the #marketing-analytics Slack channel?"

---

### Dashboard Alert Investigation

| Field | Value |
|-------|-------|
| **Persona** | Business Intelligence Analyst |
| **Industry** | SaaS |
| **User Story** | As a BI Analyst, when metrics anomalies occur, I need to quickly investigate and explain them. |
| **Tools Involved** | Looker/Tableau, Snowflake, Slack, Google Docs |

**Prompt:**
> "Our daily signups dashboard is showing a 40% drop today. Can you check the underlying data in Snowflake to confirm, look at our marketing spend and campaign status, check if there were any site incidents in #engineering, investigate what's causing the drop, and post your findings to #data-team with a recommendation on whether we need to escalate?"

---

### Automated Reporting

| Field | Value |
|-------|-------|
| **Persona** | Analytics Manager |
| **Industry** | Retail |
| **User Story** | As Analytics Manager, I need to automate recurring reports that go to stakeholders. |
| **Tools Involved** | Snowflake, Google Sheets, Gmail, Slack |

**Prompt:**
> "Can you set up a weekly report that pulls our top 10 products by revenue from Snowflake every Monday morning, updates the Google Sheet we share with merchandising, and emails a summary to the VP of Merchandising and posts it to #merchandising-metrics in Slack?"

---

## 10. IT Operations

### System Health Check

| Field | Value |
|-------|-------|
| **Persona** | IT Operations Manager |
| **Industry** | Enterprise |
| **User Story** | As IT Ops Manager, I need a daily summary of system health across our infrastructure. |
| **Tools Involved** | Datadog, PagerDuty, AWS, Slack, Google Sheets |

**Prompt:**
> "Give me this morning's system health check. Can you pull the status of all our critical services from Datadog, check if there were any PagerDuty incidents overnight, get our AWS cost and usage summary for yesterday, and post a morning status report to #it-ops? If anything is in warning or critical state, also message me directly."

---

### Software License Management

| Field | Value |
|-------|-------|
| **Persona** | IT Manager |
| **Industry** | Enterprise |
| **User Story** | As IT Manager, I need to track software licenses and optimize spend. |
| **Tools Involved** | Okta, Zylo/Productiv, Google Sheets, Slack, Gmail |

**Prompt:**
> "Can you pull our active user counts for all SaaS apps from Okta, compare them against our license counts in Zylo, identify any apps where we're paying for more seats than we're using, create a license optimization report in Google Sheets, and send recommendations to #it-finance? Flag any savings opportunities over $5k annually."

---

### Service Desk Metrics

| Field | Value |
|-------|-------|
| **Persona** | IT Service Desk Manager |
| **Industry** | Enterprise |
| **User Story** | As Service Desk Manager, I need to track team performance and identify improvement areas. |
| **Tools Involved** | ServiceNow/Jira Service Desk, Google Sheets, Slack |

**Prompt:**
> "Can you pull last week's service desk metrics from ServiceNow - total tickets, average resolution time, SLA compliance, and customer satisfaction scores - compare them to our targets, identify the top 3 ticket categories driving volume, and post a weekly performance summary to #it-service-desk with any action items?"

---

## Cross-Functional Workflows

### Quarterly Business Review Coordination

| Field | Value |
|-------|-------|
| **Persona** | Operations Manager |
| **Industry** | Any |
| **User Story** | As Ops Manager, I need to coordinate QBR preparation across multiple departments. |
| **Tools Involved** | Salesforce, Google Sheets, Google Slides, Slack, Gmail, Google Calendar |

**Prompt:**
> "QBRs are in 2 weeks. Can you send reminders to Sales, CS, Product, and Engineering leads asking for their quarterly updates, create a shared Google Slides deck with sections for each team, set up a rehearsal meeting for the Monday before, pull preliminary metrics from Salesforce for the exec summary slide, and track who's submitted their sections in a Google Sheet?"

---

### M&A Due Diligence

| Field | Value |
|-------|-------|
| **Persona** | Corporate Development |
| **Industry** | Technology |
| **User Story** | As Corp Dev, I need to gather information during acquisition due diligence. |
| **Tools Involved** | Google Drive, Slack, Email, LinkedIn, Crunchbase |

**Prompt:**
> "We're doing diligence on acquiring TechStartup Inc. Can you create a secure folder in Google Drive for diligence materials, pull their company profile and funding history from Crunchbase, find LinkedIn profiles for their leadership team, set up a private Slack channel #project-alpha for our deal team, and draft an initial outreach email to their CEO from our standard template?"

---

## Appendix: Prompt Pattern Reference

### Structure of Effective Multi-Tool Prompts

1. **Context**: Explain the situation or trigger
2. **Data Sources**: Specify where to get information
3. **Processing**: What to do with the data
4. **Output**: Where to deliver results
5. **Notification**: Who to inform

### Example Pattern

> "[Context] I need to [goal]. Can you [action 1] from [source 1], [action 2] from [source 2], [process/analyze], [create output] in [destination], and [notify] in [channel]?"

---

*Document generated: 2025-12-16*  
*Source: Arcade customer conversations via HubSpot/Sybill*
