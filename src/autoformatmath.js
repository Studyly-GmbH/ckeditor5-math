import { Autoformat, blockAutoformatEditing, Plugin } from 'ckeditor5';
import Math from './math';

export default class AutoformatMath extends Plugin {
	static get requires() {
		return [ Math, Autoformat ];
	}

	afterInit() {
		const editor = this.editor;
		const command = editor.commands.get( 'math' );
 		const autoformat = editor.plugins.get( 'Autoformat' );
		if ( command ) {
			const mathBlockCallback = getCallbackFunctionForBlockAutoformat( editor, command );

			blockAutoformatEditing(editor, Autoformat,/^\\\[$/, mathBlockCallback);
			blockAutoformatEditing(editor, Autoformat,/^\$\$$/, mathBlockCallback);
		}
	}

	static get pluginName() {
		return 'AutoformatMath';
	}
}

function getCallbackFunctionForBlockAutoformat( editor, command ) {
	return () => {
		if ( !command.isEnabled ) {
			return false;
		}

		command.display = true;
		editor.plugins.get( 'MathUI' )._showUI();
	};
}
