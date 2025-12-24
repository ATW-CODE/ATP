\# ATP Database Schema



This document defines the relational database schema for ATP.



\## Database Choice

\- PostgreSQL

\- Chosen for strong relational integrity, transactions, and scalability



---



\## Tables Overview



\### users

Stores user identity and authentication data.



Fields:

\- id (PK)

\- name

\- email (unique)

\- password\_hash

\- role

\- created\_at

\- updated\_at



---



\### files

Stores uploaded document metadata.



Fields:

\- id (PK)

\- user\_id (FK → users.id)

\- original\_filename

\- storage\_path

\- file\_type

\- file\_size

\- created\_at



---



\### printers

Represents physical printers or kiosks.



Fields:

\- id (PK)

\- name

\- location\_name

\- latitude

\- longitude

\- status

\- created\_at



---



\### print\_jobs

Core workflow table that tracks print lifecycle.



Fields:

\- id (PK)

\- user\_id (FK → users.id)

\- file\_id (FK → files.id)

\- printer\_id (FK → printers.id)

\- status

\- copies

\- color

\- pages

\- cost

\- created\_at

\- updated\_at



---



\### wallets

Tracks user balance.



Fields:

\- id (PK)

\- user\_id (FK → users.id, UNIQUE)

\- balance

\- updated\_at



---



\### transactions

Audit log of wallet activity.



Fields:

\- id (PK)

\- wallet\_id (FK → wallets.id)

\- amount

\- type (debit / credit)

\- reference

\- created\_at



---



\## Relationships Summary



\- One user → many files

\- One user → many print jobs

\- One printer → many print jobs

\- One user → one wallet

\- One wallet → many transactions



---



\## Design Principles

\- Strong relational integrity

\- Explicit foreign keys

\- Clear job state transitions

\- Audit-safe wallet handling



