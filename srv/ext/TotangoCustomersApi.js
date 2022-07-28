/**
 * CDS Remote Service implementation for the Totango API.
 * When a CAP Service handler executes the remote API, this
 * class will process it.
 * 
 * We construct the payload for the Totango API in the `before`
 * handler. Then execute the request in the `on` handler (here we)
 * just delegate to the default implementation for execution).
 * 
 * The Totango API will only handle 1000 customer results
 * per call so we must manually implement a paging mechanism.
 * Here we use the req.data value to pass in a skipToken and batchSize
 * to enable paging through all the customers.
 * The caller must repeatedly execute the API to parse all customers.
 */
const cds = require('@sap/cds');

class TotangoCustomersApi extends cds.RemoteService {
    async init() {
        this.reject(['UPDATE', 'DELETE'], '*');

        this.before('CREATE', '*', (req) => {
            try {
                //console.log('[TotangoCustomersApi] req.data in the CREATE handler:', req.data);
                if (!req.data) {
                    throw new Error('Totango skipToken is missing');
                }
                const totangoAPISkipToken = req.data.skip;
                const totangoBatchSize = req.data.batch;

                const appToken = process.env.TOTANGO_APP_TOKEN;
                if (!appToken) {
                    throw new Error('Totango API key is missing!');
                }

                req.headers = {
                    "app-token": appToken,
                    "Content-Type": "application/x-www-form-urlencoded"
                };

                req.data = buildPayload(totangoAPISkipToken, totangoBatchSize);
            } catch (error) {
                req.reject(400, error.message);
            }
        });

        this.on('CREATE', '*', async (req, next) => {
            // delegate execution to the default implementation
            const response = await next(req);
            return parseResponse(response);
        });

        super.init();
    }
}

/**
 * Build the Totango API payload
 * 
 * @param {string} skipToken The offset into the customer records.
 * e.g skipToken=500 means that we will request customer starting at the 500th
 * customer.
 * @param {string} batch The size of the batch of customer records to ask for.
 * e.g. batch=500 means that we will request 500 customers from the given
 * skipToken.
 * @returns payload for api call
 */
function buildPayload(skipToken, batchSize) {
    //var payload = 'query= {"terms":[{"type":"string_attribute","attribute":"Account Type","in_list":["Solution"]}],"count":'
    //+ batchSize + ',"offset":' + skipToken +
    //',"fields":[{"type":"string_attribute","attribute":"Account Type","field_display_name":"Account Type"},{"type":"string_attribute","attribute":"Status","field_display_name":"Status"},{"type":"string_attribute","attribute":"Region L1","field_display_name":"Region L1"},{"type":"string_attribute","attribute":"Region L2","field_display_name":"Region L2"},{"type":"string_attribute","attribute":"Country","field_display_name":"Country"},{"type":"string_attribute","attribute":"Standard_Industry_Code","field_display_name":"Industry Code"},{"type":"owner","account_role":"CEE","field_display_name":"CEE"},{"type":"number_metric","metric""sum__contract_value","field_display_name":"ACV (Sum)","source":"rollup"},{"type":"string","term":"health","field_display_name":"Health rank"},{"type":"string_attribute","attribute":"Cloud Health Assessment","field_display_name":"Cloud Health Assessment"},{"type":"lifecycle_attribute","attribute":"CS Sentiment (testing)","field_display_name":"CS Sentiment"},{"type":"list_attribute","attribute":"CS Sentiment Reason","field_display_name":"CS Sentiment Reason"},{"type":"number_metric","metric":"__consumption_1541081333110","field_display_name":"Entitlement Consumption %","source":"userdef"},{"type":"number_metric","metric":"consumption_actual__1581062831848","field_display_name":"Foundational Usage %","source":"userdef"},{"type":"products","field_display_name":"Products","direct":false},{"type":"simple_date_attribute","attribute":"Contract Renewal Date","field_display_name":"Next Renewal Date"},{"type":"number_attribute","attribute":"Days_Until_Next_Renewal","field_display_name":"Days Until Next Renewal"},{"type":"string_attribute","attribute":"Renewal_Type","field_display_name":"Renewal Type"},{"type":"string_attribute","attribute":"GTM_Internal_Account_Classification_IAC","field_display_name":"Int Acct Classification"},{"type":"number_attribute","attribute":"Number of touchpoints created in the last 14 days","field_display_name":"Touchpoints (14d)"},{"type":"last_touch_timestamp","field_display_name":"Last Touch"},{"type":"number_attribute","attribute":"Satisfaction score","field_display_name":"Satisfaction score"},{"type":"simple_date_attribute","attribute":"Contract Start Date","field_display_name":"Contract Start Date"}],"scope":"all"}'

    var payload = 'query= {"terms":[{"type":"string_attribute","attribute":"Account Type","in_list":["Solution"]}],"count":'
        + batchSize + ',"offset":' + skipToken + ',"fields":['
        + '{"type":"string_attribute","attribute":"Account Type","field_display_name":"Account Type"},'
        + '{"type":"string_attribute","attribute":"Status","field_display_name":"Status"},'
        + '{"type":"string_attribute","attribute":"Region L1","field_display_name":"Region L1"},'
        + '{"type":"string_attribute","attribute":"Region L2","field_display_name":"Region L2"},'
        + '{"type":"string_attribute","attribute":"Country","field_display_name":"Country"},'
        + '{"type":"string_attribute","attribute":"Standard_Industry_Code","field_display_name":"Industry Code"},'
        + '{"type":"owner","account_role":"CEE","field_display_name":"CEE"},'
        + '{"type":"number_metric","metric":"sum__contract_value","field_display_name":"ACV (Sum)","source":"rollup"},'
        + '{"type":"string","term":"health","field_display_name":"Health rank"},'
        + '{"type":"string_attribute","attribute":"Cloud Health Assessment","field_display_name":"Cloud Health Assessment"},'
        + '{"type":"lifecycle_attribute","attribute":"CS Sentiment (testing)","field_display_name":"CS Sentiment"},'
        + '{"type":"list_attribute","attribute":"CS Sentiment Reason","field_display_name":"CS Sentiment Reason"},'
        + '{"type":"number_metric","metric":"__consumption_1541081333110","field_display_name":"Entitlement Consumption %","source":"userdef"},'
        + '{"type":"number_metric","metric":"consumption_actual__1581062831848","field_display_name":"Foundational Usage %","source":"userdef"},'
        + '{"type":"products","field_display_name":"Products","direct":false},'
        + '{"type":"simple_date_attribute","attribute":"Contract Renewal Date","field_display_name":"Next Renewal Date"},'
        + '{"type":"number_attribute","attribute":"Days_Until_Next_Renewal","field_display_name":"Days Until Next Renewal"},'
        + '{"type":"string_attribute","attribute":"Renewal_Type","field_display_name":"Renewal Type"},'
        + '{"type":"string_attribute","attribute":"GCO_Account_Classification","field_display_name":"DEPRECATED: LOB: CE Acct Classification"},'
        + '{"type":"string_attribute","attribute":"GTM_Internal_Account_Classification_IAC","field_display_name":"Int Acct Classification"},'
        + '{"type":"number_attribute","attribute":"Number of touchpoints created in the last 14 days","field_display_name":"Touchpoints (14d)"},'
        + '{"type":"last_touch_timestamp","field_display_name":"Last Touch"},'
        + '{"type":"number_attribute","attribute":"Satisfaction score","field_display_name":"Satisfaction score"},'
        + '{"type":"simple_date_attribute","attribute":"Contract Start Date","field_display_name":"Contract Start Date"},'
        + '{"type":"string_attribute","attribute":"Country_Global_Level_01","field_display_name":"DEPRECATED: Region"},'
        + '{"type":"number_metric","metric":"foundational_usage_clc__1626798308089","field_display_name":"Foundational Usage (CLC) %","source":"userdef"},'
        + '{"type":"string_attribute","attribute":"CEE_EMAIL","field_display_name":"DEPRECATED - CEE Email"},'
        + '{"type":"owner", "account_role":"CSP_BTP", "field_display_name": "CSP - BTP"}'
        + '],"scope":"all"}';
    return payload;
}

/**
 * Parse the response into the data Customers entity data structure.
 * 
 * NOTE: cee_name and cee_email are used as temporary fields, which allows
 * us to pull out all the unique Cees later on.
 * 
 * @param {array} The response from teh Totango API call - an array of
 * objects/customers.
 * @returns array of customers
 */
function parseResponse(response) {
    var accounts = response.response.accounts.hits;
    var responseData = [];
    for (var i = 0; i < accounts.length; i++) {
        var data = {};
        data.account_id = accounts[i].name;
        data.customer_name = accounts[i].display_name;
        data.account_type = accounts[i].selected_fields[0];
        data.status = accounts[i].selected_fields[1];
        data.region = accounts[i].selected_fields[2];
        data.market_unit = accounts[i].selected_fields[3];
        data.country = accounts[i].selected_fields[4];
        data.industry_code = accounts[i].selected_fields[5];
        data.acv = accounts[i].selected_fields[7];
        data.health_rank = accounts[i].selected_fields[8];
        data.cloud_health_assessment = accounts[i].selected_fields[9];
        data.cs_sentiment = accounts[i].selected_fields[10];
        data.cs_sentiment_reason = accounts[i].selected_fields[11];
        data.entitlement_consumption = accounts[i].selected_fields[12];
        data.consumption_actual = accounts[i].selected_fields[13];
        data.products = accounts[i].selected_fields[14];
        data.next_renewal_date = accounts[i].selected_fields[15];
        data.days_until_next_renewal = accounts[i].selected_fields[16];
        data.renewal_type = accounts[i].selected_fields[17];
        data.ce_acct_classification = accounts[i].selected_fields[18];
        data.int_acct_classification = accounts[i].selected_fields[19];
        data.shelfware = null;
        data.days_in_shelfware = null;
        data.last_touch = accounts[i].selected_fields[21];
        data.satisfaction_score = accounts[i].selected_fields[22];
        data.contract_start_date = accounts[i].selected_fields[23];

        // for mapping of cee fields
        const owner_object = accounts[i].selected_fields[27]; // Owner CSP - BTP 
        if (owner_object) {
            if (owner_object.owner_value) {
                data.cee_name = owner_object.owner_value;
            } else {
                data.cee_name = null;
            }
            if (owner_object.owner_tid_value) {
                data.cee_email = owner_object.owner_tid_value;
            } else {
                data.cee_email = null;
            }
        }

        responseData.push(data);
    }
    return responseData;
}

module.exports = TotangoCustomersApi;
