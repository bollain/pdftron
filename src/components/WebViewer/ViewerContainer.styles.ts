import styled from 'styled-components';
import { HEIGHT_CONSTANT } from './ViewerContainer';

export const ViewerContainer = styled.div<{ width: number; }>`
	display: flex;
	align-items: stretch;
	height: ${(props) => props.width * HEIGHT_CONSTANT}px;
	min-height: 25rem;
	position: relative;
	visibility: ${(props) => props.visible ? 'visible' : 'hidden'}
`;