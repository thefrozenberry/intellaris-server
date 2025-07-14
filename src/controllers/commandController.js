const commandService = require('../services/commandService');

class CommandController {
    async executeCommand(req, res) {
        try {
            const { command, isRemote, connectionDetails } = req.body;

            if (!command) {
                return res.status(400).json({
                    success: false,
                    error: 'Command is required'
                });
            }

            let result;
            if (isRemote && connectionDetails) {
                result = await commandService.executeRemoteCommand(command, connectionDetails);
            } else {
                result = await commandService.executeLocalCommand(command);
            }

            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new CommandController(); 