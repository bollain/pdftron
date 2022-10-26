import { memo, useState } from 'react';
import ViewerContainer from '../WebViewer/ViewerContainer';

import * as el from './Block.styles';

function Block() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<el.BlockStyles>
			<button
				title={`${isOpen ? 'Collapse' : 'Expand'}`}
				className="block-title"
				onClick={() => setIsOpen(!isOpen)}>
				<div className="block-row">
					<p className="block-item">Test file</p>
				</div>
				<span className="expand-btn">
					{isOpen ? 'Close' : 'Open'}
				</span>
			</button>
				<ViewerContainer visible={isOpen} />
		</el.BlockStyles>
	);
}

export default memo(Block);
