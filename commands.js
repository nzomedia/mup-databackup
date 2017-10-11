
const nodemiral = require("nodemiral");

module.exports = {

    //Definition of the backup command:
    backup: {
        description: "Backup app data and database files.",
        //la destination est maintenant prise dans mup.js
        // builder: function(yargs){
        //     return yargs.options({
        //         "destination": {
        //             description: "A directory where files will be put.",
        //             alias: "dest",
        //             type: "string",
        //             demandOption: true,
        //             requiresArg: true
        //         }
        //     })
        // },
        handler: function(api){
            stopServices(api)
            .then(function(){
                return backupAppData(api);
            })
            .catch(function(error){
                console.log("error:", error);
            });
        }
    }
}

/**
 * Return a connexion to the server hosting the meteor app.
 * 
 * @param {any} api 
 * @returns {nodemiral.session}
 */
function getMeteorSession(api){
    let meteorSession = api.getSessions(["meteor"]);
    const config = api.getConfig();
    if(!meteorSession || !meteorSession.length){
        meteorSession = nodemiral.session(
                    config.servers.one.host, 
                    {
                        username: config.servers.one.username,
                        password: config.servers.one.password
                    },
                    {
                        ssh: {
                            port: config.servers.one.opts.port
                        }
                    }
                );
    }
    return meteorSession;
}

/**
 * Stop each deployed service:
 * @param api {Object} mup api object to access configuration and other usefull functions.
 */
function stopServices(api){    
    return api.runCommand("meteor.stop")
        .then(
            function(){
                console.log("Meteor app and container stoped");
                return api.runCommand("mongo.stop");
            }, manageError
        )
        .then(
            function(){
                console.log("MariaDb server and container stoped");
            }, manageError
        );
    
    function manageError(error){
        console.log("Error:", error.nodemiralHistory);
        return Promise.resolve();
    }
}


/**
 * 
 * 
 * @param {any} api 
 */
function backupAppData(api){
    const meteorSession = getMeteorSession(api);
    console.log("Backup app data:");
    const currentServer = api.getConfig().databackup.servers.one;
    meteorSession.executeScript(
        api.resolvePath(__dirname, "assets/backupData.sh"),
        {
            vars: {
                paths: currentServer.sourcePaths,
                destination: currentServer.destinationPath
            }
        },
        function(err, sshStatusCode, logs){
            if(err){
                console.log("Backup job finished with error:", error);
                return;
            }
            console.log("Logs:");
            console.log("Stdout:", logs.stdout);
            console.log("Stderr:", logs.stderr.length?logs.stderr:"empty");
            console.log("Backup completed successfully.");
        }
    )
}