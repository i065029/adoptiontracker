# Adoption Tracker

Welcome to the SAP P&T CEE Adoption Tracker V2 project.

This is a multi-target archive (MTA) based project incorporating the following:
- CAP - provides OData V4 services for the adoption tracker
- Fiori Elements app - customers - main application for a CEE to view their customers and work with activities on these customers
- Fiori Elements app - activities - show a list of all activities across all customers (handy for BTP CSPs to see all their activities in one view)
- Fiori Elements app - products - a simple maintenance app for BTP products (allows admin to edit BTP products with development work and re-deployment)
- HDI container service for HANA Cloud db
- HTML5 repository
- SAP Managed approuter (requires Launchpad service)



# Getting started

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide
`mta.yaml` | Multi-target archive config file for creating and linking cloud foundry services
`xs-security.json` | xsuaa configuration

CDS annotations are split-out into the following files within the UI application (`/app/customers`):
- capabilities.cds | Specify capabilities of each service
- layouts.cds | Specify layout related annotations (LineItem, HeaderInfo, etc)
- field-control.cds | Annotations for individual field control
- labels.cds | Annotations for field labels
- value-helps.cds | Annotations for value-helps.

The general direction is that we will use Fiori Elements for as much of the app as possible and SAPUI5 extensions if and when necessary.

## Git branches
Branch | Purpose
-------|--------
`main` | Must always be working and deployable for a production release - do not merge to here!
`develop` | Integration branch
`<feature branch>` | Create your own feature branch and wjhen tested merge into `develop`.


# Development

Git clone this repository to your development machine.

## SAPUI5 VERSION

The SAPUI5 version is specified in the local index.html and launchpad_sandpit.html files.
We tend to mainly develop with index.html to keep the launchpad stuff out of the way.

We must however run the automated OPA5 tests using the FLP sandbox (launchpad_sandpit.html) as it is required so that OPA5 can perform a browser BACK operation.

The UI5 version must also be specified in the manifest.json for when the app is run from within the Launchpad service.
```
"sap.platform.cf": {
    "ui5VersionNumber": "1.96"
},
```

NOTE: These UI5 versions need to be kept in sync. For the launchpad sandbox (unfortunately) we have to specify the full patch version of UI5 like `1.96.9` instead of just `1.96`.

## Dependencies
*Note: These are pre-installed in Business Application Studio.*

Install the UI5 command-line tools and generators as follows:
```
npm i -g @ui5/cli
npm i -g @sap/ux-ui5-tooling
npm i -g @sap/generator-fiori
```

Install the cf cli:
```
brew --version  # if no output then install brew
brew install cloudfoundry/tap/cf-cli
cf --version
```

Is the MTA build tool installed (`mbt --version`), if not:
```
npm i -g mbt
```
 Is the cf multiapps plugin installed (`cf plugins`), if not:
 ```
 cf install-plugin multiapps
 ```

Install/update CAP tooling:
```
npm i -g @sap/cds-dk
cds -v
```

If using vscode, install the following extensions:
- SAP CDS language support
- Fiori tools extension pack

Install Yeoman (and sapui5 templates) if not already (`yo --version`):
```
npm i-g yo
npm i -g yo @sapui5/generator-sapui5-templates
```

`cd` into the project directory and run `cds watch`

NOTE: We can use the CF cli DefaultEnv plugin to automatically generate a local default-env.json file for local testing with the Totango API (and xsuaa, hana etc).

## Deployment to Cloud Foundry
For development we are using:

```
API endpoint:   https://api.cf.ap10.hana.ondemand.com
org:            P&T CEE
space:          dev
```

For Production:
```
API endpoint:   https://api.cf.ap10.hana.ondemand.com
org:            BTPCSP
space:          dev
```

General development and testing should take place locally with `cds watch`.

If you wish to manually deploy to a CF org/space then first login (`cf l`) to the org/space and build and deploy with:
```
mbt build
cf deploy mta_archives/adoptiontracker_1.0.0.mtar
```

TODO(JS): Major/Minor releases should bump the package.json version number.

*The TOTANGO API KEY must be provided to the deployed service*. This can be done in the BTP cockpit by navigating to the CAP service inside your space and then creating a user-provided variable.

## cFLP and Index.html
This app is setup to use the managed approuter.
It can be launched from the dev [pntcee Launchpad](https://pntcee.launchpad.cfapps.ap10.hana.ondemand.com/site?siteId=4e2c56b8-f75d-40fe-8393-e4e4e736ae8e#Shell-home).

During development testing with `cds watch` you can launch index.html.

## Testing
For testing locally with `cds watch` we can use csv files to populate the sqlite database.
Note that there are two sub-folders under the `/db` folder:
- csv
- data

The `csv` folder is for configuration data that a user cannot change. Data in these csv files will be imported to the HANA db on deployment. Be careful not to put any *transactional* data files in here!

The `data` folder is for test transactional table data. These data files will not be imported into hana on deployment and so are only used for local testing with sqlite.

### UI app testing
The Fiori Elements `customers` app can be tested with OPA5 by using this URL:
```
http://localhost:4004/customers/webapp/test/integration/OpaTests.qunit.html
```
You must already have `cds watch` running in the terminal.

Or, simply run `npm run test`

NOTE: When the test runner first launches it randomly fails wiuth an error about missing sap global namespace - simple refresh the page and it will run fine.


## Totango API
We are using a totango report to import the customer data.

Totango Report: `https://app.totango.com/t11/sap/#/impact-segment/account/985387/list`

This report must be run by a user that is part of the GLOBAL team (otherwise it will not have access to all customer data).
After report execution Totango gives you the option to generate an API with a sample curl command and include an API token.

Example curl request (MUST replace the API Token):
```
curl --data 'query= {"terms":[{"type":"string_attribute","attribute":"Account Type","in_list":["LOB - Analytics","LOB - Business Technology Platform"]}],"count":1000,"offset":0,"fields":[{"type":"string_attribute","attribute":"Account Type","field_display_name":"Account Type"},{"type":"string_attribute","attribute":"Status","field_display_name":"Status"},{"type":"string_attribute","attribute":"Region L1","field_display_name":"Region L1"},{"type":"string_attribute","attribute":"Region L2","field_display_name":"Region L2"},{"type":"string_attribute","attribute":"Country","field_display_name":"Country"},{"type":"string_attribute","attribute":"Standard_Industry_Code","field_display_name":"Industry Code"},{"type":"owner","account_role":"CEE","field_display_name":"CEE"},{"type":"number_metric","metric":"sum__contract_value","field_display_name":"ACV (Sum)","source":"rollup"},{"type":"string","term":"health","field_display_name":"Health rank"},{"type":"string_attribute","attribute":"Cloud Health Assessment","field_display_name":"Cloud Health Assessment"},{"type":"lifecycle_attribute","attribute":"CS Sentiment (testing)","field_display_name":"CS Sentiment"},{"type":"list_attribute","attribute":"CS Sentiment Reason","field_display_name":"CS Sentiment Reason"},{"type":"number_metric","metric":"__consumption_1541081333110","field_display_name":"Entitlement Consumption %","source":"userdef"},{"type":"number_metric","metric":"consumption_actual__1581062831848","field_display_name":"Foundational Usage %","source":"userdef"},{"type":"products","field_display_name":"Products","direct":false},{"type":"simple_date_attribute","attribute":"Contract Renewal Date","field_display_name":"Next Renewal Date"},{"type":"number_attribute","attribute":"Days_Until_Next_Renewal","field_display_name":"Days Until Next Renewal"},{"type":"string_attribute","attribute":"Renewal_Type","field_display_name":"Renewal Type"},{"type":"string_attribute","attribute":"GCO_Account_Classification","field_display_name":"LOB: CE Acct Classification"},{"type":"string_attribute","attribute":"GTM_Internal_Account_Classification_IAC","field_display_name":"Int Acct Classification"},{"type":"number_attribute","attribute":"Number of touchpoints created in the last 14 days","field_display_name":"Touchpoints (14d)"},{"type":"last_touch_timestamp","field_display_name":"Last Touch"},{"type":"number_attribute","attribute":"Satisfaction score","field_display_name":"Satisfaction score"},{"type":"string_attribute","attribute":"CEE_EMAIL","field_display_name":"DEPRECATED - CEE Email"},{"type":"simple_date_attribute","attribute":"Contract Start Date","field_display_name":"Contract Start Date"}],"scope":"all"}' --header 'app-token:<TOTANGO API TOKEN>' 'https://api-eu1.totango.com/api/v1/search/accounts'
```

## BTP Entitlements
The following BTP entitlements are required on your deployment subaccount:
- Cloud Foundry Runtime at least 2GB (for testing)
- NOT REQUIRED AS AN ENTITLEMENT : Launchpad service (we recommended running from the launchpad service so that ui5-flexiblity works)
- HANA Cloud (smallest 30GB instance is good for testing)
- HDI Containers and Schema


## SQL for data migration
This sql allows you to find all activities that are associated with 'analytics' customers and move them to the 'btp' customers. The same can be repeasted for Risks.

```
-- Select all activties for 'Analytics' customers
--   show the customer name
--   show the equivalent BTP customer ID (note can't use top/limit in subselects with hana cloud - use max instead)
--   show the activity ID
--   show the activity short text
select (select customer_name from ADOPTIONTRACKER_DB_CUSTOMERS where ID = to_customer_id) as customer, 
        to_customer_id as customer_id,
       (select max(ID) from ADOPTIONTRACKER_DB_CUSTOMERS where customer_name = (select concat(substring(customer_name, 1, length(customer_name)-12), ' - Business Technology Platform') from ADOPTIONTRACKER_DB_CUSTOMERS where ID = to_customer_id)) as btp_customer_id,
        ID as activity_id, 
        short_text as activity_text
  from ADOPTIONTRACKER_DB_ACTIVITIES
  where TO_CUSTOMER_ID in (select ID from ADOPTIONTRACKER_DB_CUSTOMERS where customer_name like '% Analytics')
```

```
-- !!! WARNING !!!
-- Update all activities for analytics customers
--   Update the activties related customer_id (to_customer_id) to be the equivalent 'Business Technology Platform' customer
update ADOPTIONTRACKER_DB_ACTIVITIES
    set to_customer_id = (select max(ID) from ADOPTIONTRACKER_DB_CUSTOMERS where customer_name = (select concat(substring(customer_name, 1, length(customer_name)-12), ' - Business Technology Platform') from ADOPTIONTRACKER_DB_CUSTOMERS where ID = to_customer_id))
    where to_customer_id in (select ID from ADOPTIONTRACKER_DB_CUSTOMERS where customer_name like '% Analytics')
```

## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
