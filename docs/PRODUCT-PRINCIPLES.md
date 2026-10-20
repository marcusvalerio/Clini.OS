# Clini.OS — Product principles

**Audience:** staff and coordinators at a social organization, with distinct access for administrative and professional follow-up work.  
**First customer:** one NGO. **Architecture:** tenant-aware so additional organizations can be supported later.  
**Reference skill:** [Revenue-Centric Design](https://github.com/heliocosta-dev/revenue-centric-design), by heliocosta-dev, distilling principles from Richard (@richardrx). Consult the upstream skill and its license for full context.

## Translate the design philosophy to social impact

The goal is not to maximize purchases or screen time. The goal is to help a team complete essential work with less friction, better continuity, and responsible handling of sensitive information.

### 1. One obvious next step
Each screen should make the next useful action clear for its role. During setup, guide the coordinator through organization details, team permissions, and the first beneficiary record.

### 2. Value before complexity
Demonstrate a useful workflow before introducing advanced configuration. Avoid making a new NGO learn every module before it can complete its first task.

### 3. Honest interface
Never display invented beneficiaries, appointments, totals, growth percentages, or impact metrics. When the system has no data, explain what will appear and how to get started.

### 4. Role-specific relevance
A coordinator needs operational visibility; a professional needs their authorized follow-ups and schedule; reception needs safe registration and scheduling; finance needs administrative transactions. Do not expose professional notes to roles that do not need them.

### 5. Fewer, connected workflows
Prioritize the complete path from beneficiary registration → responsible parties → consent and documents → authorized follow-up → activity / agenda → operational reporting. Do not add features only to make the menu look comprehensive.

### 6. Retention through trust and continuity
Make history, handoffs, upcoming actions, and pending documentation useful. Never create artificial urgency, manipulative notifications, or lock-in around sensitive records.

### 7. Measure operational outcomes
After instrumentation is available, consider:
- Time to complete the first beneficiary record.
- Percentage of incomplete records and missing required documents.
- Follow-ups completed versus overdue.
- Time required to find a relevant, authorized record.
- Adoption by role and recurring workflow completion.
- Support requests and error rates.

Use these measures to improve the service, not to rank individual professionals without context.

### 8. Privacy is part of the experience
Request only data needed for the organization's work. Separate administrative records from professional follow-up notes. Provide clear access boundaries, audit trails, correction procedures, retention rules, and private document access.

## Initial information architecture
- Overview / actionable work queue
- Beneficiaries and responsible parties
- Professional follow-ups
- Calendar and activities
- Private documents
- Projects and programs
- Administrative finance
- Team and role permissions
- Reports and audit history

## First-run activation
1. Configure the organization.
2. Invite the team and assign least-privilege roles.
3. Register one beneficiary and responsible party.
4. Record consent / required documentation.
5. Create an authorized follow-up or activity.
6. Confirm the relevant user can find the record, and an unauthorized role cannot read restricted notes.

The interface must not imply that these steps are already completed when the database/authentication layer is not connected.
