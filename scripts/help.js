#!/usr/bin/env node


const indent = 1;

let npmCommands = [
	"start",
	"stop",
	"restart",
	"install",
	"run [script]"
]


let npmScripts = {
	"start": "Start Grunt",
	"package": "Package flatcal",
	"test": "Test flatcal",
	"help": "Print commands and description",
	"lint": "Lint flatcal",
	"confetti": "Pretty self explanatory",
	"post-release": "update sentry"
}

// let npmScriptsArgs = {
// 	"test": "[problemName]"
// }

let gitHooks = {
	"pre-push": "Triggers npm test"
}




// --- Format Helper ---
let format = (cmds) => {
	const longestCmd = Object.keys(cmds).sort((a, b) =>  b.length - a.length)[0].length;

	// indent cmds
	Object.keys(cmds).forEach((cmd) => {
		let rename = ' '.repeat(longestCmd - cmd.length + indent) + cmd;
	    cmds[rename] = cmds[cmd];
	    delete cmds[cmd];
	});

	// sort usage
	let usage = JSON.stringify(cmds, Object.keys(cmds).sort((a, b) => {
		return a.replace(/^\s*/, '').localeCompare(b.replace(/^\s*/, ''));
	}));

	// format
	return usage.replace(/:/g, '  ').replace(/({|}|"|')/g, '').replace(/,/g, '\n');
}




// --- Format NPM Commands Usage ---
npmCommands = npmCommands.sort();
npmCommands = npmCommands.map((cmd) => {
	return ' '.repeat(indent)+'npm '+cmd;
})
let npmUsage = npmCommands.join('\n');




// --- Log Usage to Console ---
require('colors');
console.log('NPM Usage'.underline.bold);
console.log(`${npmUsage}\n\n`);

console.log('NPM Scripts'.underline.bold);
console.log(`${format(npmScripts)}\n\n`);

// console.log('NPM Script Optional Arguments'.underline.bold);
// console.log(`${format(npmScriptsArgs)}\n\n`);

console.log('Git Hooks'.underline.bold);
console.log(`${format(gitHooks)}\n\n`);