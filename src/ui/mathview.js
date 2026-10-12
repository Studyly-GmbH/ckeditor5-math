import { View } from 'ckeditor5';

import { getKatexParseError, renderEquation } from '../utils';

export default class MathView extends View {
	constructor( engine, lazyLoad, locale, previewUid, previewClassName, katexRenderOptions ) {
		super( locale );

		this.engine = engine;
		this.lazyLoad = lazyLoad;
		this.previewUid = previewUid;
		this.previewClassName = previewClassName;
	  	this.katexRenderOptions = katexRenderOptions;

		this.set( 'value', '' );
		this.set( 'display', false );
		this.set( 'parseError', null );

		// only input changes re-render; a generic 'change' listener would also fire when parseError is set
		const onInputChange = () => {
			if ( this.isRendered ) {
				this.updateMath();
			}
		};
		this.on( 'change:value', onInputChange );
		this.on( 'change:display', onInputChange );

		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-math-preview'
				]
			}
		} );
	}

	updateMath() {
		this.parseError = this.engine === 'katex'
			? getKatexParseError( this.value, this.display, this.katexRenderOptions )
			: null;
		renderEquation( this.value, this.element, this.engine, this.lazyLoad, this.display, true, this.previewUid, this.previewClassName,
		  this.katexRenderOptions );
	}

	render() {
		super.render();
		this.updateMath();
	}
}
