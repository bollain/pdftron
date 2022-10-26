import { memo, useEffect, useRef } from 'react';
import PdfTron from '@pdftron/webviewer';
import { setDefaultAnnotationColor } from './utils';

export const WEBVIEWER_PATH = '/8.9.0';
export const WEBVIEWER_LICENSE_KEY = import.meta.env[
	'REACT_APP_PDFTRON_WEB_LICENSE'
];

interface Props {
	container: { height: number; width: number; };
}

function getLocalAnnotations() {
	return JSON.parse(window.localStorage.getItem('file_xfdf_data') || '{}');
}

function setLocalAnnotations(storedAnnotations) {
	return window.localStorage.setItem('file_xfdf_data', JSON.stringify(storedAnnotations));
}

function createAnnotation(annotationId, data) {
	const storedAnnotations = getLocalAnnotations();
	storedAnnotations[annotationId] = data;
	setLocalAnnotations(storedAnnotations);
}

function updateAnnotation(annotationId, data) {
	const storedAnnotations = getLocalAnnotations();
	storedAnnotations[annotationId] = data;
	setLocalAnnotations(storedAnnotations);
}

function deleteAnnotation(annotationId) {
	const storedAnnotations = getLocalAnnotations();
	delete storedAnnotations[annotationId];
	setLocalAnnotations(storedAnnotations);
}

async function onAnnotationCreated(annotationManager, data) {
	const xfdf = data.xfdf;
	let annotations = await annotationManager.importAnnotations(
		xfdf
	);
	const annotation = annotations[0];
	if (annotation) {
		await annotation.resourcesLoaded();
		annotation.authorId = data.val().authorId;
		annotationManager.redrawAnnotation(annotation);
	}
}

function WebViewer({ container }: Props) {
	const viewer = useRef(null) as any;

	useEffect(() => {
	let instanceForCleanup;
	console.log('in use effect')


		PdfTron(
			{
				licenseKey: WEBVIEWER_LICENSE_KEY,
				path: WEBVIEWER_PATH,
				filename: 'PDFTron test file',
				initialDoc: 'http://127.0.0.1:3001/test_file.pdf',
				annotationUser: 'Test user',
				preloadWorker: 'pdf',
				enableFilePicker: false,
				enableMeasurement: true,
				enableOptimizedWorkers: true,
				disabledElements: [
					'toolbarGroup-Edit',
					'dropdown-item-toolbarGroup-Edit',
					'toolbarGroup-Forms',
					'dropdown-item-toolbarGroup-Forms',
					'toolbarGroup-FillAndSign',
					'dropdown-item-toolbarGroup-FillAndSign',
					'toolbarGroup-Insert',
					'dropdown-item-toolbarGroup-Insert',
					'thumbnailControl',
					'viewControlsDivider1',
					'rotateHeader',
					'rotateClockwiseButton',
					'rotateCounterClockwiseButton',
					'stampToolGroupButton',
					'fileAttachmentToolGroupButton',
				],
			},
			viewer.current
		).then(async (instance) => {
			const { documentViewer, annotationManager, Annotations, Tools } = instance.Core;
			instanceForCleanup = instance;
			documentViewer.addEventListener('documentLoaded', () => {
				const storedAnnotations = getLocalAnnotations();
				Object.values(storedAnnotations).forEach(annotation => {
					onAnnotationCreated(annotationManager, annotation);
				})
			});

			setDefaultAnnotationColor(
				documentViewer,
				Annotations,
				Tools,
				'#DB464A'
			);

			// Bind annotation change events to a callback function
			annotationManager.addEventListener(
				'annotationChanged',
				async (annotations, type, info) => {
					if (info.imported) {
						return;
					}
					const xfdf = await annotationManager.exportAnnotations({ annotList: annotations });
					annotations.forEach((annotation) => {
						if (type === 'add') {
							createAnnotation(annotation.Id, { xfdf });
						} else if (type === 'modify') {
							updateAnnotation(annotation.Id, { xfdf });
						} else if (type === 'delete') {
							deleteAnnotation(annotation.Id);
						}
					});
				}
			);
		});
		// eslint-disable-next-line

		return () => {
			console.log('cleanup')
			instanceForCleanup?.UI.dispose();
		}
	}, []);

	return (
		<div
			ref={viewer}
			style={{
				height: container.height,
				width: container.width,
				backgroundColor: '#f9f9f9',
				borderRadius: '4px',
			}}
		/>
	);
}

export default memo(WebViewer);
