import View from '@ckeditor/ckeditor5-ui/src/view';

import { renderEquation } from '../utils';

export default class MathView extends View {
	constructor( engine, lazyLoad, locale, previewUid, previewClassName ) {
		super( locale );

		this.engine = engine;
		this.lazyLoad = lazyLoad;
		this.previewUid = previewUid;
		this.previewClassName = previewClassName;

		this.set( 'value', '' );
		this.set( 'display', false );

		this.on( 'change', () => {
			if ( this.isRendered ) {
				this.updateMath();
			}
		} );

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
		console.log('this.updateMath()');
		console.log('this.value');
		console.log(this.value);
		console.log('this.element');
		console.log(this.element);
		renderEquation( this.value, this.element, this.engine, this.lazyLoad, this.display, true, this.previewUid, this.previewClassName );
	}

	render() {
		super.render();
		this.updateMath();
	}
}
