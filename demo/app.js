import {
	ClassicEditor,
	Essentials,
	Paragraph,
	Bold,
	Italic
} from "ckeditor5";
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import Math from "../src/math";

ClassicEditor.create(document.querySelector("#editor"), {
	plugins: [Essentials, Paragraph, Bold, Italic, Math],
	toolbar: ["bold", "italic", "math"],
	math: { engine: "katex" },
})
	.then((editor) => {
		console.log("Editor was initialized", editor);
		CKEditorInspector.attach(editor)
	})
	.catch((error) => {
		console.error(error);
		console.error(error.stack);
	});
