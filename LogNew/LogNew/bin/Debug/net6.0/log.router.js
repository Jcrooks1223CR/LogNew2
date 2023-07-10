const os = require('os');
const fs = require('fs');
const platform = os.platform();
let dir = "";
let xdir = "";
if (platform === 'win32') {
    dir = "\\";
    xdir = "/";
} else {
    dir = "/";
    xdir = "\\";
}
//console.log(platform);

class router {
    constructor() {
    }

    async toConsole(logMessage) {
        /*
            this function should define the format for a logMessage when published to the console.
            this format will be standard for all log publishing to the console as part of this
            solution.
        */
        if (!logMessage) {
            //console.log('no message received') logging no message
            exit;
        } else {
            const message = await logMessage;
            console.log(message);
        }
    }

    async toFile(logMessage,config) {
        // log message returns as a promise object.
        // since returns as an object, it is unable to be appended to the file.
        // using await allows logMessage to stay a string.
        if (!logMessage) {
            exit;
        }

        const message = await logMessage;

        let fullpath = '';
        
        if (config?.location) {
            
            if (config.location.startsWith('.')) {
                fullpath += __dirname;
            } 

            fullpath += config.location;
            
            const regex = new RegExp(xdir,"g");
            fullpath = fullpath.replace(/\./g,dir).replace(regex,dir)
            
            if (!fs.existsSync(fullpath)) {
                fs.mkdirSync(fullpath,{recursive:true});
            }
            
            fullpath += dir;
        }

        let filename = '';

        if (config?.name) {
            filename += config.name;
        } else {
            filename += 'default.log';
        }

        console.log(fullpath.toString());
        console.log(filename);

        const file = fullpath + filename;
    
    // When appendFile is called and logFile.log doesn't exist, the file will be created by the function.
        fs.appendFile(file, message, (err) => {
            if (err) throw err;
        //console.log("The string was successfully appended to the file!");
        });
    }

    async toAPI(logMessage) {
    /*
            this function should define the format for a log Data when published to the console.
            this format will be standard for all log publishing an api as part of this
            solution.
        */
        if ( !logMessage ) {
            exit;
        }
        const url = 'http://devakafkacon01.harrahs.org/errorlogging/Logger.asmx/LogError';
        
        //const message = 'paramXmlDocument='+encodeURIComponent('<error><parameter name=\"severity\">TEST</parameter></error>');
        //const message = 'paramXmlDocument='+encodeURIComponent('<error><parameter name=\"severity\">ERROR</parameter><parameter name=\"notes\">This is a test of the new RaaS logging framework</parameter></error>');
        const message = 'paramXmlDocument='+encodeURIComponent(await logMessage);
        
        // let response = new Response();
        // const option = 2;

        // if (option === 1 ) {
        //     response = await fetch(url, {
        //         method: 'POST',
        //         headers: {
        //           Accept: 'text/xml',
        //           'Content-Type': 'application/x-www-form-urlencoded'
        //         },
        //         body: message,
        //         cache: 'default'
        //     })
        //     .finally(request => {
        //         console.log(request)
        //     });

        // } else {
            const logapirequest = new Request(url, {
                method: 'POST',
                headers: {
                  Accept: 'text/xml',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: message,
                cache: 'default'
            });

            const response = await fetch(logapirequest);
        //}

        //console.log(response.status);
        //console.log(response.statusText);
        //console.log(response);
    }

  // async toDB(logData) {
  //     /*
  //         this function should define the format for a log Data when published to the console.
  //         this format will be standard for all log publishing to a database as part of this
  //         solution.
  //     */
  //     const pool = new Pool({
  //         user: "1",
  //         host: "2",
  //         database: "3",
  //         password: "4",
  //         port: "5",
  //         });
  //         const logQuery = {
  //         text: "insert log",
  //         values: [logData],
  //         };

  //         pool
  //         .query(logQuery)
  //         .then(() => {
  //             console.log("[DATABASE] log successfully saved");
  //             pool.end();
  //         })
  //         .catch((error) => {
  //             console.log("[DATABASE] error saving log: ", error);
  //             pool.end();
  //         });
  //     return logMessage;
  // }
}
module.exports = router;