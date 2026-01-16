import { Autoformat, first, Plugin } from 'ckeditor5';
import Math from './math';

//TODO remove this on the next upgrade bc there is the function already defined in AutoFORMAT but not available in this version
//code copied from a node module plugin
 function blockAutoformatEditing(editor, plugin, pattern, callbackOrCommand) {
    let callback;
    let command = null;
    if (typeof callbackOrCommand == 'function') {
        callback = callbackOrCommand;
    } else {
        // We assume that the actual command name was provided.
        command = editor.commands.get(callbackOrCommand);
        callback = ()=>{
            editor.execute(callbackOrCommand);
        };
    }
    editor.model.document.on('change:data', (evt, batch)=>{
        if (command && !command.isEnabled || !plugin.isEnabled) {
            return;
        }
        const range = first(editor.model.document.selection.getRanges());
        if (!range.isCollapsed) {
            return;
        }
        if (batch.isUndo || !batch.isLocal) {
            return;
        }
        const changes = Array.from(editor.model.document.differ.getChanges());
        const entry = changes[0];
        // Typing is represented by only a single change.
        if (changes.length != 1 || entry.type !== 'insert' || entry.name != '$text' || entry.length != 1) {
            return;
        }
        const blockToFormat = entry.position.parent;
        // Block formatting should be disabled in codeBlocks (#5800).
        if (blockToFormat.is('element', 'codeBlock')) {
            return;
        }
        // Only list commands and custom callbacks can be applied inside a list.
        if (blockToFormat.is('element', 'listItem') && typeof callbackOrCommand !== 'function' && ![
            'numberedList',
            'bulletedList',
            'todoList'
        ].includes(callbackOrCommand)) {
            return;
        }
        // In case a command is bound, do not re-execute it over an existing block style which would result in a style removal.
        // Instead, just drop processing so that autoformat trigger text is not lost. E.g. writing "# " in a level 1 heading.
        if (command && command.value === true) {
            return;
        }
        const firstNode = blockToFormat.getChild(0);
        const firstNodeRange = editor.model.createRangeOn(firstNode);
        // Range is only expected to be within or at the very end of the first text node.
        if (!firstNodeRange.containsRange(range) && !range.end.isEqual(firstNodeRange.end)) {
            return;
        }
        const match = pattern.exec(firstNode.data.substr(0, range.end.offset));
        // ...and this text node's data match the pattern.
        if (!match) {
            return;
        }
        // Use enqueueChange to create new batch to separate typing batch from the auto-format changes.
        editor.model.enqueueChange((writer)=>{
            // Matched range.
            const start = writer.createPositionAt(blockToFormat, 0);
            const end = writer.createPositionAt(blockToFormat, match[0].length);
            const range = new LiveRange(start, end);
            const wasChanged = callback({
                match
            });
            // Remove matched text.
            if (wasChanged !== false) {
                writer.remove(range);
                const selectionRange = editor.model.document.selection.getFirstRange();
                const blockRange = writer.createRangeIn(blockToFormat);
                // If the block is empty and the document selection has been moved when
                // applying formatting (e.g. is now in newly created block).
                if (blockToFormat.isEmpty && !blockRange.isEqual(selectionRange) && !blockRange.containsRange(selectionRange, true)) {
                    writer.remove(blockToFormat);
                }
            }
            range.detach();
            editor.model.enqueueChange(()=>{
                const deletePlugin = editor.plugins.get('Delete');
                deletePlugin.requestUndoOnBackspace();
            });
        });
    });
}

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


			//TODO: add autoformat.addRule()
			blockAutoformatEditing(editor, /^\\\[$/, mathBlockCallback);
			blockAutoformatEditing(editor, /^\$\$$/, mathBlockCallback);
			// Autoformat.addRule( editor, this, /^\\\[$/, mathBlockCallback );
			// blockAutoformatEditing( editor, this, /^\$\$$/, mathBlockCallback );
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
