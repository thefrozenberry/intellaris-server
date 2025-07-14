const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const NodeSSH = require('node-ssh');
const ssh = new NodeSSH();

// List of allowed commands for security
const ALLOWED_COMMANDS = [
    'ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv',
    'pm2', 'npm', 'node', 'git', 'docker',
    'systemctl', 'service', 'apt-get', 'apt'
];

// Validate command for security
const validateCommand = (command) => {
    const firstWord = command.split(' ')[0].toLowerCase();
    return ALLOWED_COMMANDS.includes(firstWord);
};

class CommandService {
    async executeLocalCommand(command) {
        if (!validateCommand(command)) {
            throw new Error('Command not allowed for security reasons');
        }

        try {
            const { stdout, stderr } = await execAsync(command);
            return {
                success: true,
                output: stdout,
                error: stderr
            };
        } catch (error) {
            return {
                success: false,
                output: null,
                error: error.message
            };
        }
    }

    async executeRemoteCommand(command, connectionDetails) {
        if (!validateCommand(command)) {
            throw new Error('Command not allowed for security reasons');
        }

        try {
            await ssh.connect({
                host: connectionDetails.host,
                username: connectionDetails.username,
                password: connectionDetails.password,
                // If using private key authentication
                // privateKey: connectionDetails.privateKey,
            });

            const result = await ssh.execCommand(command);
            ssh.dispose();

            return {
                success: true,
                output: result.stdout,
                error: result.stderr
            };
        } catch (error) {
            return {
                success: false,
                output: null,
                error: error.message
            };
        }
    }
}

module.exports = new CommandService(); 