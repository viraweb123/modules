//import MbModule from './module.js';

const ANCHOR_TOOLBAR_COMMON = 'amh.workbench.editor.weburger.toolbar#common';


/***************************************************************************
 * Name: vw-studio-removeEmptyElement.js
 * Version: 0.1.0
 * Author: 
 * 	- Mostafa Barmshory (mostafa.barmshory@gmail.com)
 * 
 * 
 * Finds all empty widgets from the current editor and remove them all.
 * 
 **************************************************************************/

function removeEmptyWidget(root) {
	var toDelete = [];
	var count = 0;
	var children = root.getChildren();
	_.forEach(children, function(child) {
		if (!(_.includes(['img', 'audio', 'video'], child.getType())) &&
			_.isEmpty(child.getChildren()) &&
			!child.getModelProperty('html') &&
			!child.getModelProperty('text')) {
			toDelete.push(child);
			count++;
		} else {
			count += removeEmptyWidget(child);
		}
	});
	_.forEach(toDelete, function(item) {
		item.delete();
	});
	return count;
}

/*
 * Creates and load modules
 * @ngInject
 */
function loadModule(
	/* AngularJS */ $window,
	/* MBlowfish */ $actions,
	/* VW-Studio */ $amhEditorService) {

	// add actions
	$actions.newAction({
		id: 'studio.extension.rel.removeAll',
		priority: 15,
		icon: 'remove_circle',
		title: 'Remove Emplty Elements',
		description: 'Find and remove empty elements from current document',
		visible: function() {
			var wb = $amhEditorService.getWorkbench();
			if (!wb) {
				return false;
			}
			if (!wb.getContentValue()) {
				return false;
			}
			return true;
		},
		/*
		 * @ngInject
		 */
		action: function() {
			//			$window.alert('hi');
			var editors = $amhEditorService.getWorkbench().getEditors();
			_.forEach(editors, function(editor) {
				var rootWidget = editor.getRootWidget();
				var count = 0;
				if (rootWidget) {
					count = removeEmptyWidget(rootWidget);
				}
				$window.alert('Number of widgets which are removed: ' + count);
			});

		},
		groups: [ANCHOR_TOOLBAR_COMMON]
	});
}

/***************************************************************************
 * Integeration code
 * 
 **************************************************************************/
mblowfish.addExtension(loadModule);
