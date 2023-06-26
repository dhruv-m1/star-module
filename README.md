# STAR Module (2017)

(Archieved)

STAR Module (Stock Transfer and Receipt Module) is a web application I made during High School and submitted as my practical project for Computer Science.

<br/>

<a href="https://github.com/dhruv-tech/star-module/blob/master/STAR_archieve_screenshot.gif"><img alt="Application Screenshot" src="https://github.com/dhruv-tech/star-module/blob/master/STAR_archieve_screenshot.gif?raw=true" width="700"></a>

(Click to enlarge, GIF may take a few seconds to load)
## Introduction

STAR Module was built as a web application for keeping track of the inflow and outflow of stock within warehouses of a retail/manufacturing company.

Conventionally, heaps of logbooks are used to keep track of the same. When stock is transferred from a warehouse, the product names, quantity per batch and destination are written in a logbook. 
A copy of this information is also attached with the consignment as a note. This information is then checked at the destination warehouse to verify the consignment. 

STAR Module attempts to digitize this process.

The application is a 'module' in that, it is expected to be integrated with an existing bussiness application (or user authentication system) that calls its `/createSession` API endpoint to authenticate and thereafter, opens its interface in a new pop out window.

## Tech Stack

Node.js, Express, EJS, Bootstrap, JQuery, [InstaScan](https://github.com/schmich/instascan) (for QR code scanning), Normalize (CSS Reset), MongoDB.

## Features

### Dashbaord

* Gives a general overview and statistics of the inventory and stock transfers at the current location.

### Scan (Transfer In/Receipt Process)

* Ability to receive a consignment by scanning a QR Code with a predefined structure.
* Appropriate action on QR Code scan: 
  * Consignment is rejected if the QR Code scanned refers to a log with a different destination than the location at which it was scanned.
  * Consignment is cancelled if the QR code is scanned at the origin of the transfer. 
  * Consignment is accepted if scanned at the correct destination. 
  * If an accepted consignment is scanned again, appropriate message is displayed.
  * Any QR code in wrong format is ignored.
  * If a consignment is ‘accepted’ or ‘cancelled’, the inventory is updated appropriately. i.e. stock added to destination if accepted, or stock added back to origin if cancelled

### Transfer Out Wizard

* Ability to initiate a transfer consignment based on article ID.
  * Starts at the Transfer Registration page, the location id of the current location is auto-populated, article ID is sought from the user.
  * Submitting the form leads to the 'Transfer selection page' with correct details of the product with associated article id.
  * The Transfer Selection Page shows the Batch Numbers of the selected product along with the available quantity for each batch. Input fields to enter the desired transfer quantity for each batch are provided. Form is validated.
  * Successful submission of this form leads to a printable page with a packing slip consisting of a QR code that can be scanned in the ‘scan section’ of the application.

### Inventory

* Inventory at current location displayed in tabular format with columns: ID, Name, Quantity and Actions.
* The data is searchable on the Name and ID field.

###  Logs

* Logs of stock transfers displayed in tabular format with columns: ID, Origin, Product Id, Quantity and Details.
* Data is searchable on the Product ID, Origin and ID fields.
* Separate tables for receipts and transfers are provided.

(Note: receipts = consignments from factories; transfers = consignments to/from other warehouses).

### Directory

* List of all stock locations within the company displayed in tabular format with columns: ID, Name, Address, and Phone. 
* Separate tables for warehouses and factories.

## Further Details

* For introduction and context, click [here](https://github.com/dhruv-tech/star-module).
* For screenshots and wireframes, click [here](https://github.com/dhruv-tech/star-module/wiki/Screenshots-and-Wireframes).
* For details on Backend Implementation, click [here](https://github.com/dhruv-tech/star-module/wiki/Backend-Implementation).
* For details on Frontend workflow, click [here](https://github.com/dhruv-tech/star-module/wiki/Frontend-workflow).
* For Entity Relationship Diagram, click [here](https://github.com/dhruv-tech/star-module/wiki/Entity-Relationship-Diagram).

---

**Repository made public when archived.
