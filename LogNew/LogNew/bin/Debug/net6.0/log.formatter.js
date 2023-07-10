const os = require('os');
const fs = require('fs');
const platform = os.platform();
const eol = os.EOL;
const timestamp = new Date(Date.now()).toISOString();

class formatter {
	constructor () {
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
                    logData.transaction.route - the route for the endpoint that
                                                initiated the process
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

    async forConsole(level, logData) {
        /*
            this function should define the format for a logMessage when published to the console.
            this format will be standard for all log publishing to the console as part of this
            solution.
        */
        if ( !level || !logData ) {
            // write logger error to default logger file
            exit;
        }

        const recordLevel = level;
        const { host, source, transaction, code, message, http, trace, data } = logData;
        const printtrace = trace.toString();
        const logMessage = `${timestamp} - ${recordLevel} - ${host} - ${source} - ${transaction.correlationid} - ${code} - ${message}\n${printtrace}\n`;
        return logMessage;
    }

    async forFile(level, logData) {
        /*
            this function should define the format for a log Data when published to the console.
            this format will be standard for all log publishing to files as part of this
            solution.
        */
        if ( !level || !logData ) {
            // write logger error to default logger file
            exit;
        }

        const recordLevel = level;
        let { host, source, transaction, code, message, http, trace, data } = logData;
                
        const printtrace = trace.replace(/\n    /g,`${eol}        `).replace("Trace","    Stack Trace");
        
        const logMessage = `${timestamp} - ${recordLevel} - ${host} - ${source} - ${transaction.correlationid} - ${code} - ${message}${eol}    Transaction Trace${eol}        ${transaction.trace}${eol}${printtrace}${eol}`;
        return logMessage;
    }

    async forAPI(level, logData) {
        /*
            this function should define the format for a log Data when published to the console.
            this format will be standard for all log publishing an api as part of this
            solution.
        */
        if ( !level || !logData ) {
            // write logger error to default logger file
            exit;
        }

        const recordlevel = level;
        const { timestamp, host, source, transaction, code, message, http, trace, data } = await logData;

        let logMessage = `<error>
                            <parameter name="severity">${recordlevel}</parameter>
                            <parameter name="host">${host}</parameter>
                            <parameter name="source">${source}</parameter>
                            <parameter name="message">${code} - ${message}</parameter>`;
        
        if ( transaction?.correlationid || http || data ) {
            let notes = ``;
        
            if ( transaction?.correlationid ) {
                notes += `correlationid - ${transaction.correlationid}`;
            } else {
                notes += 'no correlation id provided';
            }
            
            if (http) {
                if ( http?.request || http?.response ) {
                    notes += '\n\nHTTP RESPONSE';
                        
                    if ( http?.response?.status ) {
                        notes += `\nSTATUS\n${http.response.status}`;
                    } else {
                        notes += '\nSTATUS\nnone';
                    }
                    
                    if ( http?.response?.headers ) {
                        notes += `\nHEADERS\n${http.response.headers}`;
                    } else {
                        notes += '\nHEADERS\nnone';
                    }
                    
                    if ( http?.response?.data ) {
                        notes += `\nDATA\n${http.response.data}`;
                    } else {
                        notes += '\nDATA\nnone';
                    }
                    
                    notes += '\nHTTP REQUEST';

                    if ( http?.request?.headers ) {
                        notes += `\nHEADERS\n${http.request.headers}`;
                    } else {
                        notes += '\nHEADERS\nnone';
                    }
                        
                    if ( http?.request?.data ) {
                        notes += `\nDATA\n${http.request.data}`;
                    } else {
                        notes += '\nDATA\nnone';
                    }
                }
            }

            if ( transaction?.trace ) {
                notes += `\n${transaction.trace}`;
            }

            if ( data ) {
                notes += `\nDATA\n${data}`;
            }
            
            notes = notes.replace(/</g,'*').replace(/>/g,'*');
            logMessage += `<parameter name="notes">${notes}</parameter>`;
        }

        if ( trace ) {
            const stacktrace = trace.replace(/</g,'*').replace(/>/g,'*');
            logMessage += `<parameter name="stacktrace">${stacktrace}</parameter>`;
        }
        
        if ( transaction?.route ) {
            logMessage += `<parameter name="requestURL">${transaction.route}</parameter>`;
        }
        
        logMessage += `</error>`;
        
        //console.log(logMessage);
        return logMessage;
    }

    async forDB(level, logData) {
        /*
            this function should define the format for a log Data when published to the console.
            this format will be standard for all log publishing to a database as part of this
            solution.
        */
        
        // not configured at this time - Michael Hebert - 2023-05-30
    
        if ( !level || !logData ) {
            // log logger error to default logger file
            exit;
        }
        
        return logMessage;
    }
}

module.exports = formatter;