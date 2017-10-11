const _commands=require("./commands");

module.exports =  {
	name: "mup-databackup",
    description: "Backup or restore app data and settings.",
    commands: _commands,
    hooks: {

    },
    validate: {
        "databackup": function(config, utils){            
            var joi = require('joi');
                
            var schema = joi.object().keys({
                    
                servers: joi.object().pattern(/.+/,
                    joi.object().keys({
                    sourcePaths: joi.array().items(joi.string()).single().min(1).unique().required(),
                    destinationPath: joi.string().required()
                    })
                ).min(1)
            });

            var details = [];
            
            var validationErrors = joi.validate(config.databackup, schema, utils.VALIDATE_OPTIONS);
            details = utils.combineErrorDetails(details, validationErrors);
            
            return utils.addLocation(details, 'databackup');
        }
    }
}
