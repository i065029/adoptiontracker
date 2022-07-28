const cds = require('@sap/cds');
const res = require('express/lib/response');
const LOG = cds.log('customers-service');
const uuid = require('uuid');

const MAX_TOTANGO_CALLS = 1000;
const TOTANGO_BATCH_SIZE = 250;  // 1000 is the max totango will support, however we get timeouts occasionally
const CLOUD_REPORTING_URL = 'https://reporting.ondemand.com/sap/crp/cdo?type=crp_c&id=';
const BG_JOB_INTERVAL_HOURS = 6;

//cds.env.log.levels = { remote: 'debug' };

// /**
//  * Enumeration values for FieldControlType
//  * @see https://github.com/SAP/odata-vocabularies/blob/master/vocabularies/Common.md#FieldControlType
//  */
// const FieldControl = {
//     Mandatory: 7,
//     Optional: 3,
//     ReadOnly: 1,
//     Inapplicable: 0,
// };

/**
 * CAP service entrypoint
 */
module.exports = cds.service.impl(async function () {
    const {
        Customers,
        Activities,
        Cees,
        Settings,
        MaturityAssessments,
        MaturityAssessmentsAnalytics,
        ActivationPhases,
        TasksMaster,
        PhaseTasks,
        PhasesMaster,
        Test } = this.entities;

    let backgroundJob = null;

    /**
     * Before a customer is read
     * 
     * Pre-fill maturity assessment values if they do not alrady exist
     */
    this.before('READ', 'Customers', async (req) => {
        if (req.params[0]?.ID) {
            await createMissingMaturityAssessments(req.params[0].ID);
            await creatingInitialActivationPhases(req.params[0].ID);
        }
    });

    /**
     * Manually sort the MaturityAssessment data by dimension
     * 
     * There is a bug in Fiori Elements where the PresentationVariant 
     * annotation is not working on tables with segmented buttons (for
     * different views). This is a workaround to sort the data manually.
     */
    this.after('READ', 'MaturityAssessments', (response) => {
        if (Array.isArray(response)) {
            response = response.sort((a, b) => {
                if (a.dimension_code < b.dimension_code) {
                    return -1;
                }
                if (a.dimension_code > b.dimension_code) {
                    return 1;
                }
                return 0;
            });
        }
    });

    /**
     * Manually sort the MaturityAssessmentAnalytics data by domainName
     * 
     * Doesn't seems to be a way to use chart annotations to sort the axis values.
     */
    this.after('READ', 'MaturityAssessmentsAnalytics', (response) => {
        if (Array.isArray(response)) {
            response = response.sort((a, b) => {
                if (a.domainName < b.domainName) {
                    return -1;
                }
                if (a.domainName > b.domainName) {
                    return 1;
                }
                return 0;
            });
        }
    });

    /**
     * After reading Customers populate the virtual fields
     *
     * Using the parameter name `each` is a convenience shortcut
     * that will iterate over the customers and call the function
     * with each record.
     * https://cap.cloud.sap/docs/node.js/services#srv-after
     */
    this.after('READ', 'Customers', (each) => {
        // Regex to match the number before the "__" characters
        if (each.account_id) {
            var account_number = each.account_id.match(/([\d.]+) *__/)[1];
            if (account_number) {
                each.cr_url = CLOUD_REPORTING_URL + parseInt(account_number);
            }
        }

        if (each.consumption_actual) {
            each.consumption_perc = each.consumption_actual * 100;
        }

        if (each.cs_sentiment) {
            switch (each.cs_sentiment) {
                case 'Green':
                    each.cs_sentiment_criticality = 3;
                    break;
                case 'Yellow':
                    each.cs_sentiment_criticality = 2;
                    break;
                case 'Red':
                    each.cs_sentiment_criticality = 1;
                    break;
                default:
                    each.cs_sentiment_criticality = 0;
            }
        }

        if (each.cloud_health_assessment) {
            switch (each.cloud_health_assessment) {
                case 'Healthy(CHS)':
                    each.cloud_health_assessment_criticality = 3;
                    break;
                case 'Neutral(CHS)':
                    each.cloud_health_assessment_criticality = 2;
                    break;
                case 'Unhealthy(CHS)':
                    each.cloud_health_assessment_criticality = 1;
                    break;
                default:
                    each.cloud_health_assessment_criticality = 0;
            }
        }
    });

    /**
     * Handler for Settings singleton
     * 
     * Read the default values (next()).
     * Replace the default if authorised.
     */
    this.on('READ', 'Settings', async (req, next) => {
        LOG.info('Reading Settings now');

        const default_values = await next();
        if (req.user.is('AdoptionTrackerAdmin')) {
            LOG.info('AUTHORISED');
            default_values.is_admin = true;
        } else {
            LOG.info('NOT AUTHORISED');
            default_values.is_admin = false;
        }
    });

    this.before('SAVE', 'Customers', validateCustomer);

    /**
     * Handler for the isAdmin() action.
     * 
     * Checks if the user as the admin authorisation role.
     */
    this.on('isAdmin', (req) => {
        LOG.info('isAdmin() called');
        if (req.user.is('AdoptionTrackerAdmin')) {
            return false;
        } else {
            return false;
        }
    });

    /**
     * Handler for updateCustomer() action
     * 
     * Read customers from Totango while updating the list of Cees.
     * Admin role is required!
     * Disable CAP integrity checks while this procedure is running else 
     * very high memory usage!
     */
    this.on('updateCustomers', (req) => {
        req.user.is('AdoptionTrackerAdmin') || req.reject(403, 'Only authorised administrators can sync data with Totango');

        // UNCOMMENT TO TEST WITHOUT CDS.SPAWN
        //LOG.info('TESTING WITHOUT SPAWN !!!');
        //performCustomerSync(Customers, Cees);

        //LOG.info('TESTING WITH SPAWN');
        //let job = cds.spawn(async _ => {
        //    await performCustomerSync(Customers, Cees);
        //});

        //job.on('succeeded', () => {
        //    LOG.info('===== Sync job successful =====');
        //});
        //job.on('failed', () => {
        //    LOG.info('!!!!! Sync job FAILED !!!!!');
        //});

        cds.env.features.assert_integrity = false;
        LOG.info('TESTING WITH SPAWN AND UNREF AT JOB END');
        let job = cds.spawn(async _ => {
            await performCustomerSync(Customers, Cees);
        });

        job.on('succeeded', () => {
            job.timer = undefined
            LOG.info('===== Sync job successful =====');
            cds.env.features.assert_integrity = true;
        });
        job.on('failed', () => {
            job.timer.unref();
            job.timer = undefined
            LOG.info('!!!!! Sync job FAILED !!!!!');
            cds.env.features.assert_integrity = true;
        });
    });

    /**
     * Handler for startJobs() action
     * 
     * Start  a CAP job to run the totango sync on a regular basis
     */
    this.on('startJobs', (req) => {
        // Only allow admin users
        req.user.is('AdoptionTrackerAdmin') || req.reject(403, 'Only authorised administrators can sync data with Totango');

        LOG.info('Started job for customer sync');
        backgroundJob = cds.spawn({ every: BG_JOB_INTERVAL_HOURS * 60 * 60 * 1000 /* ms */ }, async _ => {
            LOG.info('===== Performing the customer sync in a job =====');
            cds.env.features.assert_integrity = false;
            await performCustomerSync(Customers, Cees);
            LOG.info('===== Sync job completed =====');
            cds.env.features.assert_integrity = true;
        });
    });

    /**
     * Handler for the stopJobs() action
     * 
     * Stop the scheduled job that runs the totango sync
     */
    this.on('stopJobs', (req) => {
        // Only allow admin users
        req.user.is('AdoptionTrackerAdmin') || req.reject(403, 'Only authorised administrators can sync data with Totango');

        if (backgroundJob) {
            LOG.info('Cancelling the totango sync background job');
            clearInterval(backgroundJob.timer);
            backgroundJob = null;
            req.info('Totango sync job cancelled');
        } else {
            LOG.info('No scheduled job to stop. Ignoring request');
            req.warn('No scheduled job to stop. Ignoring request');
        }
    });

    /**
     * Action handler - Read the FREActivityService (remote) and get matching activity templates
     * 
     * Requires two parameters in the request:
     *  - customerID: the customer ID
     *  - bAll: if true, return all activity templates, otherwise return only
     *    the ones that are suggested for the customers maturity assessment.
     * 
     * If `bAll` then read all activity templates from the remote service.
     * Else, read the activity templates that are suggested for the customers maturity assessment.
     * To do this we:
     *   1) Read the maturity assessment from the customer
     *   2) Pull out the tech_domains from the maturity assessment anad get their avg scores
     *   3) For each tech domain that has a score, get the activity templates that match the score
     *   4) Finally - add a call to get the activities for the CROSS_DOMAIN (7) activities.
     *   5) Return the result.
     */
    this.on('getActivities', async (req) => {
        console.log('getActivities() called');

        const customerID = req.data.customerID;
        const bAll = req.data.bAll;

        if (!customerID) {
            return [];
        }

        const activities_service = await cds.connect.to('FREActivityService');
        const {
            FREActivities,
        } = activities_service.entities;

        let headers = {
            Authorization: req.headers.authorization
        };

        var filtered_activities = [];

        if (bAll) {

            /* GET ALL ACTIVITIES */            
            
            const result = await activities_service.send({query: SELECT.from(FREActivities, act => {
                act('*'),
                act.supportingteam(st => {
                    st('*')
                }),
                act.domain(dom => {
                    dom('*')
                }),
                act.region(reg => {
                    reg('*')
                })
            }).limit(500), headers: headers});

            filtered_activities.push(...result);
            

        } else {

            /* GET RECOMMENDED ACTIVITIES BASED ON MATURITY ASSESSMENT - ONLY */

            // Get the maturity values for the customer
            let maturity_assessments = await SELECT.from(MaturityAssessments).where `customer_ID = ${customerID}`; 
            if (maturity_assessments.length == 0) {
                // Not likely to get here unless the customer object page has the maturity facet
                // out of view. If its out of view then lazy loading won't cause the initial
                // (empty) maturity values to be inserted.
                console.log('No maturity assessments found for customer: ' + customerID);
                return [];
            }

            // Pull out the unique tech domains
            var tech_domains = [];
            for (var i = 0; i < maturity_assessments.length; i++) {
                found_domain = tech_domains.find(obj => obj.domain === maturity_assessments[i].domain_code);
                if (!found_domain) {
                    tech_domains.push({
                        'domain': maturity_assessments[i].domain_code,
                        'score': 0
                    });
                }
            }

            // Now we have the tech domains - lets average the scores for each
            var count = 0;
            for (var i = 0; i < tech_domains.length; i++) {
                count = 0;
                for (var j = 0; j < maturity_assessments.length; j++) {
                    if (maturity_assessments[j].domain_code == tech_domains[i].domain) {
                        tech_domains[i].score += maturity_assessments[j].score;
                        count += 1;
                    }
                }
                tech_domains[i].score = tech_domains[i].score / count;
            }

            // We have the required tech domains, average scores so now we can ask the FREActivityService
            // for matching activities.

            for (var i = 0; i < tech_domains.length; i++) {
                if (tech_domains[i].score > 0) {
                    const result = await activities_service.send({query: SELECT.from(FREActivities, act => {
                        act('*'),
                        act.supportingteam(st => {
                            st('*')
                        }),
                        act.domain(dom => {
                            dom('*')
                        }),
                        act.region(reg => {
                            reg('*')
                        })
                    }).where `domain_code = ${tech_domains[i].domain} and maturity_level_min <= ${tech_domains[i].score} and maturity_level_max >= ${tech_domains[i].score}`.limit(500), headers: headers});

                    filtered_activities.push(...result); //concat the result array onto filtered_activities
                }
            }

            // We now have all the recommended activities for each domain that has
            // a maturity assessment. Additionally we need to get the cross-domain
            // activities. We will get them across the whole range of maturity scores.
            tech_domains = tech_domains.filter(obj => obj.score >= 1);
            if (tech_domains.length === 0) {
                return [];
            }

            tech_domains.sort(function (a, b) { return a.score - b.score; });
            const lowest_avg_score = tech_domains[0].score;
            const highest_avg_score = tech_domains[tech_domains.length - 1].score;

            const result = await activities_service.send({query: SELECT.from(FREActivities, act => {
                act('*'),
                act.supportingteam(st => {
                    st('*')
                }),
                act.domain(dom => {
                    dom('*')
                }),
                act.region(reg => {
                    reg('*')
                })
            }).where `domain_code = 7 and maturity_level_min <= ${highest_avg_score} and maturity_level_max >= ${lowest_avg_score}`.limit(500), headers: headers});

            filtered_activities.push(...result);

        }

        console.log('filtered_activities length: ', filtered_activities.length);

        return filtered_activities;
    });

    /**
     * Action handler - Import provided (external) activities into the database.
     * 
     * req.data must include the following:
     *  - customerID: The ID of the customer to import the activities into
     *  - activities: an array of activities to import
     * 
     * NOTE: Only a subset of the activities entity is populated. The user is
     * expected to manually populate the remaining fields.
     */
    this.on('importActivities', async (req) => {
        console.log('importActivities() called');

        const customerID = req.data.customerID;
        if (!customerID) {
            console.log('[importActivities] No customer ID provided');
            return;
        }
        const external_activities = req.data.activities;
        if (!external_activities || external_activities.length == 0) {
            console.log('[importActivities] No external activities provided');
            return; 
        }

        /**
         * Map the incoming activities to the database adoptiontracker db schema
         * 
         * TODO: Each app has its own master data for FRE_PILLAR/ACTIVITY_TYPE so
         * we have to map them here which is a bit of a hack.
         * 
         * TODO: Need to map the supporting teams as well or use the activityrepo's
         * supporting teams via remote service. Currently ignored.
         * 
         * TODO: Bring the products in as well
         */
        let activities = [];
        external_activities.forEach(external_activity => {
            var fre_pillar = null;
            switch (external_activity.fre_pillar_code) {
                case 0:
                    fre_pillar = 6;
                    break;
                case 1:
                    fre_pillar = 8;
                    break;
                case 2:
                    fre_pillar = 11;
                    break;
                case 3:
                    fre_pillar = 7;
                    break;
                case 4:
                    fre_pillar = 10;
                    break;
                case 5:
                    fre_pillar = 9;
                    break;
                default:
                    fre_pillar = null;
            }

            activities.push({
                ID: uuid.v4(),
                to_customer_ID: customerID,
                activity_category_code: 1,
                activity_type_code: fre_pillar,
                short_text: external_activity.short_text,
                activity_description: external_activity.description,
                activity_status_code: 0,
                impl_support_team: ''
            });
        });

        console.log('Activities to save in DB:');

        try {
            let result = await INSERT.into(Activities).entries(activities);
            console.log('[importActivities] Imported ' + activities.length + ' activities');
        } catch (err) {
            req.error('[importActivities] Error importing activities: ' + err);
        }
    });

    /**
     * Perform any validations and checks on a Customer BEFORE saving.
     * 
     * @param {*} req 
     */
    function validateCustomer(req) {
        // Force the CreatedBy and ChangedBy fields to lower case due to some users
        // having upper case user-id's.
        if (req.data && req.data.to_activities) {
            req.data.to_activities.forEach(activity => {
                if (activity.createdBy) {
                    activity.createdBy = activity.createdBy.toLowerCase();
                }
                if (activity.modifiedBy) {
                    activity.modifiedBy = activity.modifiedBy.toLowerCase();
                }
            });
        }

        if (req.data && req.data.to_risks) {
            req.data.to_risks.forEach(risk => {
                if (risk.createdBy) {
                    risk.createdBy = risk.createdBy.toLowerCase();
                }
                if (risk.modifiedBy) {
                    risk.modifiedBy = risk.modifiedBy.toLowerCase();
                }
            });
        }
    }

    /**
     * Create maturity assessment template
     * 
     * Pre-fill the maturity assessment for the given customer with
     * all required domains and dimensions.
     * 
     * @param {String} customerId 
     */
    async function createMissingMaturityAssessments(customerId) {
        console.log('Creating missing maturity assessments for customer: ' + customerId);

        const data = await Promise.all([
            cds.read('adoptiontracker.db.MaturityAssessments').where({ customer_ID: customerId }),
            cds.read('adoptiontracker.db.MaturityDimensions'),
            cds.read('adoptiontracker.db.TechnologyDomains')
        ]);
        const maturityAssessments = data[0];
        const dimensions = data[1];
        const domains = data[2];
        const newAssessments = [];
        dimensions.forEach((dimension) => {
            domains.forEach((domain) => {
                const entry = {
                    customer_ID: customerId,
                    dimension_code: dimension.code,
                    domain_code: domain.code,
                    score: 0
                };
                newAssessments.push(entry);
            });
        });
        const payload = newAssessments.filter((entry) => {
            const hasEntry = maturityAssessments.find(maturity => maturity.domain_code === entry.domain_code && maturity.dimension_code === entry.dimension_code);
            return !hasEntry;
        });
        if (payload.length > 0) {
            await cds.create('adoptiontracker.db.MaturityAssessments').entries(payload);
        }
    }

    /**
     * Create initial Activation Phase Tasks for a customer.
     *
     * Given a Customer ID, check that there are no Activation tasks yet and
     * if not - create the initial tasks.
     * 
     * NOTE: If entities are not exposed in the service (cds) file then you must
     * use full qualified table names below. `PhasesMaster` will be undefined.
     *  
     * @param {string} customerId 
     */
    async function creatingInitialActivationPhases(customerId) {
        const allPhases = await SELECT.from('adoptiontracker.db.PhasesMaster');
        const allTasks = await SELECT.from('adoptiontracker.db.TasksMaster');

        var {
            v4: uuidv4,
        } = require('uuid');

        let phase_records = [];

        const initialized = await SELECT.from(ActivationPhases).where({to_customer_ID: customerId});
        if (initialized[0] == null && customerId)  {
            for (var i = 0; i < allPhases.length; i++) {
                let tasks_records = [];
                for (var j = 0; j < allTasks.length; j++) {
                    if (allTasks[j].phase_ID == allPhases[i].ID) {
                        allTasks[j].ID = uuidv4(),
                        allTasks[j].startdate = new Date(),
                        tasks_records.push(allTasks[j]);
                    }
                }

                allPhases[i].ID = uuidv4(),
                allPhases[i].to_customer_ID = customerId,
                allPhases[i].startdate = new Date()
                if(tasks_records) {
                    allPhases[i].to_tasks = tasks_records;
                }

                await INSERT.into(ActivationPhases).entries(allPhases[i]);
            }
        }
    }
});


/* Functions for the Totango sync operation */

/**
 * Calculate the criticality of the given date. The close `now` is to the
 * date the more critical it is.
 *
 * @param {string} renewal_date Date in format YYYY-MM-DD
 * @returns Number representing the fiori elements criticality value
 */
const get_renewal_date_criticality = (renewal_date) => {
    const now = new Date();
    const then = new Date(renewal_date);

    const diff = then.getTime() - now.getTime();
    const diff_in_days = Math.round(diff / (1000 * 3600 * 24));

    criticality = 0;
    if (diff_in_days < 31) {
        criticality = 1;
    } else if (diff_in_days < 91) {
        criticality = 2;
    } else if (diff_in_days < 181) {
        criticality = 3;
    }

    return criticality;
}

/**
 * UPSERT operation on CEEs.
 * TODO(js): This does not do an UPDATE - Does it matter? Only if CEE changes names!!
 */
const upsertCees = async (Cees, oData, oWhereCondition) => {
    const sqlResult = await SELECT`count(*)`.from(Cees).where(oWhereCondition);
    const found = Object.values(sqlResult[0])[0] !== 0;

    if (found) {
        return;
    } else {
        if (oData.cee_email !== null) {
            var ceeDataInsert = { email: oData.cee_email, name: oData.cee_name };
            await INSERT.into(Cees).entries(ceeDataInsert);
        }

    }
};

/**
 * Parse the customer data from Totango and return a unique
 * list of CEEs.
 */
const getCeesUniqueList = (oCustomersData) => {
    let oCeeRecords = [];
    for (var i = 0; i < oCustomersData.length; i++) {
        //if (oCustomersData[i].cee_email !== null) {
        if (oCustomersData[i].cee_email) {
            let CeeRecord = {
                cee_name: oCustomersData[i].cee_name,
                cee_email: oCustomersData[i].cee_email
            }
            oCeeRecords.push(CeeRecord);
        }
    }
    const uniqueValuesSet = new Set();
    const filteredArr = oCeeRecords.filter((obj) => {
        const isPresentInSet = uniqueValuesSet.has(obj.cee_email);
        uniqueValuesSet.add(obj.cee_email);
        return !isPresentInSet;
    });
    return filteredArr;
};

/**
 * Synchronise customer data from Totango
 */
const performCustomerSync = async (Customers, Cees) => {
    const totangoCustomersApi = await cds.connect.to('TotangoCustomersApi');

    /**
     * Call Totango API in batches to read all customers (setting the
     * deleted flag to false (because if its in Totango it not deleted).
     * Update the CEE entity with UPSERT operation.
     * Save customer data into an array for processing later.
     */
    let customers = [];
    for (let i = 0; i < MAX_TOTANGO_CALLS; i++) {
        LOG.info('TOTANGO - iteration:', i + 1, 'batch size:', TOTANGO_BATCH_SIZE);
        let result = await totangoCustomersApi.post(
            '/',
            {
                "skip": i * TOTANGO_BATCH_SIZE,
                "batch": TOTANGO_BATCH_SIZE
            }
        );

        if (Array.isArray(result) && result.length == 0) {
            LOG.info('No more Totango results. Exiting API loop.');
            break;
        } else if (!Array.isArray(result)) {
            LOG.error('Result of Totango API call is not an array. An error has occured.');
            req.reject(403, 'Result of Totango API call is not an array. An error has occured.');
        }

        // Upsert Cee Data
        let oCeesData = getCeesUniqueList(result);
        for (var j = 0; j < oCeesData.length; j++) {
            await upsertCees(Cees, oCeesData[j], { email: oCeesData[j].cee_email })
        }

        // Cache the customers (by using apply it flattens and pushes)
        customers.push.apply(customers, result);
    }

    /**
     * Read in all the CEE's and process an upsert operation on all the
     * customers. We do this outside of the API call loop above to avoid
     * continual lookups on the db for the CEE to match each customer.
     * Here we pass in an array of all the CEEs which is faster.
     */
    const allCees = await SELECT(Cees);
    LOG.info('All Cees read back in: ', allCees.length);

    /**
     * Update all customers as deleted. The following upsert operation
     * will then clear this flag on real/current customers in Totango.
     * This is how we handle the situation where customers have been
     * deleted from Totango - the upsert operation can't handle it.
     */
    await UPDATE(Customers).with({ deleted: true });

    // Scan through all customers to perform an UPSERT
    // Ensure to clear the deleted flag.
    for (let i = 0; i < customers.length; i++) {
        const sqlResult = await SELECT`ID`.from(Customers).where({ account_id: customers[i].account_id });
        var customerID = null;
        if (Array.isArray(sqlResult) && sqlResult.length > 0 && sqlResult[0].ID) {
            customerID = sqlResult[0].ID;
        }

        if (customers[i].cee_email) {
            const ceeRecord = allCees.find(e => e.email == customers[i].cee_email);
            if (ceeRecord) {
                customers[i].to_cee = { id: ceeRecord.id };
            }
        } else {
            customers[i].to_cee_id = null;
        }
        delete customers[i]['cee_name'];
        delete customers[i]['cee_email'];

        customers[i]['next_renewal_date_criticality'] =
            get_renewal_date_criticality(customers[i]['next_renewal_date']);
        customers[i]['currency_code'] = 'EUR';
        customers[i]['deleted'] = false;

        if (customerID) {
            await UPDATE(Customers, customerID).with(customers[i]);
        } else {
            await INSERT.into(Customers).entries(customers[i]);
        }
    }

    LOG.info('ALL Customers updated');
};
