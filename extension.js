const vscode = require('vscode')
const fs = require('fs')
const path = require('path')

class WordPressSnippetsToolbox {
	context = null
	snippetDir = null

	/**
	 * The user defined snippet set setting
	 */
	getSnippetSetSetting() {
		const cfg = vscode.workspace.getConfiguration()
		return cfg.get('wpSnippets.snippetSet', 'Full')
	}
	
	/**
	 * The actual snippets file that is being used
	 */
	getCurrentSnippetSet() {
		const activeSnippetsPath = this.getActiveSnippetsPath()
		if(fs.existsSync(activeSnippetsPath)) {
			const content = fs.readFileSync(activeSnippetsPath, 'utf8')
			if(content.includes('${1:\\')) {
				return 'Full'
			} else {
				return 'Flat'
			}
		}
		// if file contains ${1:\\, it's the full set
		return 'Full'
	}
	
	getSnippetsDir() {
		if(this.snippetDir === null) {
			this.snippetDir = path.join(this.context.extensionPath, 'snippets')
		}
		return this.snippetDir
	}
	
	getFullSnippetsPath() {
		const snippetDir = this.getSnippetsDir()
		return path.join(snippetDir, 'snippets-full.json')
	}
	
	getFlatSnippetsPath() {
		const snippetDir = this.getSnippetsDir()
		return path.join(snippetDir, 'snippets-flat.json')
	}
	
	getActiveSnippetsPath() {
		const snippetDir = this.getSnippetsDir()
		return path.join(snippetDir, 'snippets.json')
	}
	
	activate(context) {
		this.context = context
	
		/**
		 * Check if the setting and the actual snippets file are out of sync
		 * If so, prompt the user to run the action that will update the snippets.json file to their chosen setting. (Full or Flat)
		 */
		const snippetSetSetting = this.getSnippetSetSetting()
		const currentSnippetSet = this.getCurrentSnippetSet()
		if(snippetSetSetting !== currentSnippetSet) {
			vscode.window.showWarningMessage(
				`Your chosen WordPress snippet set is out of sync. Press "Reload now" to fix this.`,
				{ modal: true },
				'Reload Now', 'Ignore'
			).then(selection => {
				if(selection === 'Reload Now') {
					if(snippetSetSetting === 'Flat') {
						vscode.commands.executeCommand('extension.useFlatSnippets')
					} else {
						vscode.commands.executeCommand('extension.useFullSnippets')
					}
				}
			})
		}
	
		/**
		 * Use Full Snippets Command
		 * Converts the snippet set to Full
		 */
		this.context.subscriptions.push(vscode.commands.registerCommand('extension.useFullSnippets', async () => {
			// Ensure that the user setting for snippet set is set to Full
			await vscode.workspace.getConfiguration().update('wpSnippets.snippetSet', 'Full', vscode.ConfigurationTarget.Global)

			const fullSnippetsPath = this.getFullSnippetsPath()
			const flatSnippetsPath = this.getFlatSnippetsPath()
			const activeSnippetsPath = this.getActiveSnippetsPath()
			try {
				// Make sure that the Full snippets file exists
				if(fs.existsSync(fullSnippetsPath) && fs.existsSync(activeSnippetsPath)) {
					
					// Rename the active snippets file to snippets-flat.json
					fs.renameSync(activeSnippetsPath, flatSnippetsPath)

					// Rename the snippets-full.json file to snippets.json
					fs.renameSync(fullSnippetsPath, activeSnippetsPath)

					// Reload VSCode window
					vscode.window.showInformationMessage('Switched to Full WordPress Snippets by renaming files. Reloading window...')
					vscode.commands.executeCommand('workbench.action.reloadWindow')
				} else {
					vscode.window.showErrorMessage('Required snippets file(s) not found.')
				}
			} catch (e) {
				vscode.window.showErrorMessage('Failed to switch snippet file: ' + e.message)
			}
		}))
	
		/**
		 * Use Flat Snippets Command
		 * Converts the snippet set to Flat
		 */
		this.context.subscriptions.push(vscode.commands.registerCommand('extension.useFlatSnippets', async () => {
			// Ensure that the user setting for snippet set is set to Flat
			await vscode.workspace.getConfiguration().update('wpSnippets.snippetSet', 'Flat', vscode.ConfigurationTarget.Global)

			const flatSnippetsPath = this.getFlatSnippetsPath()
			const fullSnippetsPath = this.getFullSnippetsPath()
			const activeSnippetsPath = this.getActiveSnippetsPath()
			try {
				// Make sure that the Flat snippets file exists
				if(fs.existsSync(flatSnippetsPath) && fs.existsSync(activeSnippetsPath)) {
					
					// Rename the active snippets file to snippets-full.json
					fs.renameSync(activeSnippetsPath, fullSnippetsPath)

					// Rename the snippets-flat.json file to snippets.json
					fs.renameSync(flatSnippetsPath, activeSnippetsPath)

					// Reload VSCode window
					vscode.window.showInformationMessage('Switched to Flat WordPress Snippets by renaming files. Reloading window...')
					vscode.commands.executeCommand('workbench.action.reloadWindow')
				} else {
					vscode.window.showErrorMessage('Required snippets file(s) not found.')
				}
			} catch (e) {
				vscode.window.showErrorMessage('Failed to switch snippet file: ' + e.message)
			}
		}))
	
		/**
		 * Listen for changes to the snippet set setting and trigger the respective command
		 */
		context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
			if(event.affectsConfiguration('wpSnippets.snippetSet')) {
				const cfg = vscode.workspace.getConfiguration()
				const snippetSet = cfg.get('wpSnippets.snippetSet', 'Full')
				if(snippetSet === 'Flat') {
					vscode.commands.executeCommand('extension.useFlatSnippets')
				} else {
					vscode.commands.executeCommand('extension.useFullSnippets')
				}
			}
		}))
	
	}
	
	deactivate() {}
}

let wordPressSnippetsToolbox = new WordPressSnippetsToolbox()

module.exports = {
	activate: wordPressSnippetsToolbox.activate.bind(wordPressSnippetsToolbox),
	deactivate: wordPressSnippetsToolbox.deactivate.bind(wordPressSnippetsToolbox)
}