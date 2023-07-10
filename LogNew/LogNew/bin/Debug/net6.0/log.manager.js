const format  = require('./log.formatter');
const route = require('./log.router');
const logconfig = require("./logconfig.json"); // ENHANCEMENT NEEDED: change this to pull from the NEW app_configuration_store

class logger {
	constructor () {
        this.format = new format();
        this.route = new route();
	}

	#integerLevel(stringLevel) {
        switch(stringLevel) {
            case "error": 
                return 0;
                break;
            case "warn":
                return 1;
                break;
            case "info":
                return 2;
                break;
            case "http":
                return 3;
                break;
            case "verbose":
                return 4;
                break;
            case "debug":
                return 5;
                break;
            default:
                /* always remember to set the default value here as a last backup to any
                   and all failures to confirm the logging level in the cofigurations
                */
                return 2; 
        }
    }
    
	/*
        The following functions are provided to allow for simple syntax for posting data
        to the log regardless of transport.
        
        The following defines the structure of the logData object
            logData - the complete object for the logData
                logData.host - the hostname
                logData.source - the source of the data (function, component, overall
                                 service)
                logData.transaction
                    logData.transaction.correlationId - the correlation ID for the
                                                        transaction (and all children
                                                        spawned through to the response
                                                        to the originating requestor)
                    logData.transaction.trace - the array of routes and functions
                                                invoked in processing this transaction
                logData.code - the return code for the record if one exists
                logData.message - the message summary text (this MUST NOT include any
                                  PII or other sensitive data)
                logData.http - the transactions http information (where applicable)
                    logData.http.request - the http request associated to the error
                                           (requires sanitizing and encrypting)
                        logData.http.request.headers - the http headers from the
                                                       request
                        logData.http.request.data - the http data from the request
                    logData.http.response - the http response assiciated to the error
                                            (requires sanitizing and encrypting)
                        logData.http.response.status - the http status from the
                                                       response
                        logData.http.response.headers - the http headers from the
                                                        response
                        logData.http.response.data - the http data from the response
                logData.trace - the javascript console.trace() results from the
                                function where the error occured
                logData.data - the object(s) in use by the function at the time of the
                               error; this could include member, partner, agent data
                               both as inputs or objects being constructed as part of
                               the response or as interim data used for processing
                               (requires sanitizing and encrypting)
    */

    async log(level, logData, config) {

        //console.log('entering log method');

        if (!level || !logData ) {
            
            console.log('exiting log method - missing level and/or data');
            
            exit;
            // write write bad request error to logger error log file
        }
        
        const reqLevel = this.#integerLevel(level);

        /* set the fallback level to make sure a log is produced should there be neither a formal
           default nor a source specific logging configuration set
        */
        let logTo = {
                        "console": {
                            "level": "error",
                            "publish": true
                        },
                        "file": {
                            "level": "error",
                            "publish": false,
                            "location": "./",
                            "name": "default.log"
                        },
                        "api": {
                            "level": "error",
                            "publish": true
                        },
                        "db": {
                            "level": "error",
                            "publish": false
                        }
                    };

        if ( config ) {
            logTo = config;
        } else if ( logconfig.find(record=>record.component === logData?.source) ) {
            logTo = logconfig.find(record=>record.component === logData.source).config;
        } else if ( logData?.transaction?.trace.length > 0) {
            for ( let i = logData.transaction.trace.length - 1; i >= 0; i--) {
                //console.log(i);
                
                if (   logconfig.find(record=>record.component === logData?.transaction?.trace[i])
                    && logData.source !== logData?.transaction?.trace[i]?.component 
                    ) {
                    logTo = logconfig.find(record=>record.component === logData.transaction.trace[i]).config;
                    i = -1;
                } 
            }        
        } else if ( logconfig.find(record=>record.component === 'default') ) {
            logTo = logconfig.find(record=>record.component === 'default').config;
        }
        
        if (    logTo?.console?.publish === true
             && logTo?.console?.level 
            ) {
            const compareLevel = this.#integerLevel(logTo.console.level);
                
            if ( reqLevel > compareLevel ) {
                logTo.console.publish = false;
            }
        } 

        if (    logTo?.file?.publish === true
             && logTo?.file?.level 
            ) {
            const compareLevel = this.#integerLevel(logTo.file.level);
               
            if ( reqLevel > compareLevel ) {
                logTo.file.publish = false;
            }
        } 


        if (    logTo?.api?.publish === true
             && logTo?.api?.level 
            ) {
            const compareLevel = this.#integerLevel(logTo.api.level);
              
            if ( reqLevel > compareLevel ) {
               logTo.api.publish = false;
            }
        } 

/*        if (    logTo?.db?.publish === true
             && logTo?.db?.level 
            ) {
            const compareLevel = this.#integerLevel(logTo.db.level);
             
            if ( reqLevel <= compareLevel ) {
                publishTo.db = true;
            }
        } 
*/
        try {
            //console.log('attempting to publish based on:\n')
            //console.log(logTo);
            this.#publish(level,logData,logTo);          
		} catch (err) {
			console.log('error in log method attempt to call private publish:'+err);
            // write error to logger error log file
		}
		
        //console.log('exiting log method');
	}

    async error(logData,config) {
        
        //console.log('entering error method');

        if (!logData ) {
            
            //console.log('exiting error method - missing data');
            
            exit;
            // write write bad request error to logger error log file
        }
        
        //console.log('exiting error method - forward to log method');
        
        this.log('error',logData,config);
    }

    async warn(logData,config) {
        
        //console.log('entering warn method');
        
        if (!logData ) {
            
            //console.log('exiting warn method - missing data');
            
            exit;
            // write write bad request error to logger error log file
        }
        
        //console.log('exiting error method - forward to log method');

        this.log('warn',logData,config);
    }

    async info(logData,config) {
        
        //console.log('entering info method');
        
        if (!logData ) {
            
            //console.log('exiting info method - missing data');
            
            exit;
            // write write bad request error to logger error log file
        }
        
        //console.log('exiting info method - forward to log method');

        this.log('info',logData,config);
    }

    async http(logData,config) {
        
        //console.log('entering http method');
        
        if (!logData?.http) {
            
            //console.log('exiting http method - no relevant http data');
            
            exit;
            // write write bad request error to logger error log file
        }
        
        //console.log('exiting http method - forward to log method');

        this.log('http',logData,config);
    }

    async verbose(logData,config) {
        
        //console.log('entering verbose method');
        
        if (!logData) {
            
            //console.log('exiting verbose method - missing data');
            
            exit;
            // write write bad request error to logger error log file
        }

        //console.log('exiting verbose method - forward to log method');

        this.log('verbose',logData,config);
    }

    async debug(logData,config) {
        
        //console.log('entering info method');
        
        if (!logData.trace && !logData.data) {
            
            //console.log('exiting debug method - no relevant trace data');
            
            exit;
            // write write bad request error to logger error log file
        }
        
        //console.log('exiting debug method - forward to log method');

        this.log('debug',logData,config);
    }

    async #publish(level,logData,logTo) {
        
        //console.log('entering private publish method');

        if (logTo.console.publish === true) {
            //console.log('publishing to console');
            this.route.toConsole(this.format.forConsole(level,logData));
        }

        if (logTo.file.publish === true) {
            //console.log('publishing to file');
            this.route.toFile(this.format.forFile(level,logData),logTo.file);
        }

        if (logTo.api.publish === true) {
            //console.log('publishing to api');
            this.route.toAPI(this.format.forAPI(level,logData));
        }

        // if (publishTo.db === true) {

        // }

        //console.log('exiting private publish method');
    } 
}
module.exports = new logger();