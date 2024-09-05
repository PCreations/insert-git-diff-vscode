import * as vscode from 'vscode';
import { exec } from 'child_process';

function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.insertGitDiff', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;

        exec('git diff HEAD~1 HEAD', (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage('Error fetching git diff: ' + stderr);
                return;
            }

            const formattedDiff = formatDiff(stdout);

            editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.active, formattedDiff);
            });
        });
    });

    context.subscriptions.push(disposable);
}

function formatDiff(diff: string) {
    const hunks = diff.split('@@');
    let formattedDiff = '';
    hunks.forEach((hunk, index) => {
        if (index > 0) {
            formattedDiff += '\n@@';
        }
        formattedDiff += `\n\`\`\`diff\n${hunk}\n\`\`\`\n`;
    });
    return formattedDiff;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};