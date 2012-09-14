
if (! window.SKGB) { window.SKGB = {}; }


window.config = {
	markWeekDay: 3,  // Wednesday
	summerStart: {month: 2, day: 15}, // March
	summerEnd: {month: 9, day: 31}  // October
};

// onload:
$(function(){
	// Tabs
	$('#tabs').tabs();
	
	var paramsSource = $('#initdata').get(0).innerHTML;
	eval('window.params = ' + paramsSource);
	var params = window.params;
	var config = window.config;
	
	// create UI controller
	var uiBindings = {
		trashDropTargetNode: $('#members-list')[0],
		memberPrototypesListNode: $('#members-list')[0],
		membersColumnTableHeaderCell: $('TABLE#stegdienst TR:first-child>TH#member-cols')[0],
		tableBody: $('TABLE#stegdienst>TBODY')[0],
		tableHeaderRow: $('TABLE#stegdienst TR:first-child')[0],
		getTableWarningCellInRow: function (i) {
			return $($('TABLE#stegdienst>TBODY>TR')[i]).find('TD.warning')[0];
		}
	};
	SKGB.stegdienstController = new SKGB.StegdienstListeInterface(uiBindings);
	
	// create data model
	var dates = getSuggestionDates(config);
	SKGB.stegdienstListe = new SKGB.StegdienstListe();
	SKGB.stegdienstListe.members = params.members;
	SKGB.stegdienstListe.setDateRange(dates);
	
	SKGB.stegdienstController.liste = SKGB.stegdienstListe;
	
	SKGB.stegdienstController.generatePrototypes();
	
	
//	$('#generate-suggestion-button').click(function(){
//		generateSuggestions();
//	});
	
	SKGB.stegdienstController.generateSuggestions(dates);  // :DEBUG:
});


function getSuggestionDates (config) {
	var today = new Date();
	var year = today.getFullYear() + (today.getMonth() < 8 ? 0 : 1);
	var startDate = new Date(year, config.summerStart.month, config.summerStart.day, 12);
	while (startDate.getDay() !== config.markWeekDay) {
		startDate.setDate(startDate.getDate() - 1);
	}
	
	var endDate = new Date(year, config.summerEnd.month, config.summerEnd.day);
	var date = new Date(startDate);
	var weekCount = 0;
	while (date < endDate) {
		date.setDate(date.getDate() + 7);
		weekCount++;
	}
	endDate = new Date(date);
	
	return { start: startDate, length: weekCount, end: endDate };
}


// ====================================================

// model
SKGB.StegdienstListe = function () {
	this.data = [];
	this.firstDate = null;
}
SKGB.StegdienstListe.constructor = SKGB.StegdienstListe;

SKGB.StegdienstListe.prototype.members = null;  // params.members


SKGB.StegdienstListe.prototype.setDateRange = function (suggestionDates) {
	if (this.data.length != suggestionDates.length) {
		if (this.firstDate != null) { throw 'Not implemented.'; }
		this.data = new Array(suggestionDates.length);
	}
	this.firstDate = suggestionDates.start;
}


SKGB.StegdienstListe.prototype.assign = function (reference, memberIndex) {
	this.data[reference.row][reference.col] = this.members[memberIndex];
}


SKGB.StegdienstListe.prototype.assignment = function (reference) {
	for (var i = 0; i < this.members.length; i++) {
		if (this.data[reference.row][reference.col] == this.members[i]) {
			return i;
		}
	}
	return -1;
}


SKGB.StegdienstListe.prototype.generateSuggestions = function (members, dates, membersPerDate) {
//	var list = new Array(dates.length);
	var memberIndex = 0;
	for (var dateIndex = 0; dateIndex < dates.length; dateIndex++) {
		this.data[dateIndex] = new Array(membersPerDate);
		for (var i = 0; i < membersPerDate; i++) {
			
/*
			// the 'strategy': simply sequential; reset the member's list when it has been run through
			memberIndex++;
			if (memberIndex >= members.length) {
				memberIndex = 0;  
			}
*/
			
			// the 'strategy': simply randomize everything
			memberIndex = parseInt(Math.random() * members.length);
			
			this.data[dateIndex][i] = members[memberIndex];
		}
	}
}



// ====================================================

SKGB.StegdienstListeInterface = function (uiBindings) {
	if (uiBindings) {
		this.ui = uiBindings;
	}
}
SKGB.StegdienstListeInterface.constructor = SKGB.StegdienstListeInterface;

SKGB.StegdienstListeInterface.prototype.liste = null;  // SKGB.StegdienstListe instance
SKGB.StegdienstListeInterface.prototype.ui = null;  // uiBindings


SKGB.StegdienstListeInterface.prototype.generatePrototypes = function () {
	var statListNode = this.ui.memberPrototypesListNode;
	var members = this.liste.members;
	
	for (var i = 0; i < members.length; i++) {
		var item = { member: members[i], domNode: document.createElement('LI') };
		this.createDraggableHtmlMemberElement(item, 'clone');
		statListNode.appendChild(item.domNode);
	}
	var instance = this;
	$(statListNode).droppable({
		scope: 'members',
//		hoverClass: 'ui-state-hover',
		tolerance: 'pointer',
		drop: function (event, ui) {
			new SKGB.StegdienstListeDrop(event, ui, instance).on(this);
		}
	});
}


SKGB.StegdienstListeInterface.prototype.generateSuggestions = function (dates) {
	var members = this.liste.members;
	
	// the number of members per date is usually 2, but occasionally has been 3 in the past during summertime
	var membersHeader = this.ui.membersColumnTableHeaderCell;
	var membersPerDate = membersHeader.colSpan;
	
	// actually generate those suggestions
	this.liste.generateSuggestions(members, dates, membersPerDate);
	var data = SKGB.stegdienstListe.data;
	
	// add suggestions to UI table
	var date = dates.start;
	for (var i = 0; i < data.length; i++) {
		this.createDomTableRowNodes(data[i], this.formatDate(date));
		date.setDate(date.getDate() + 7);
	}
	
	$('#tabs').tabs('select', 1);
	
	this.dataHasChanged();
	// open question: does this function assuma that the model is already in its correct state?
}


SKGB.StegdienstListeInterface.prototype.createDomTableRowNodes = function (suggestion, dateString) {
	
	var tableBody = this.ui.tableBody;
	var listItemForCurrentDate = new Array(suggestion.length);
	var tableRowString = '';
	
	// the header order in the HTML determines the order of the table columns
	var header = this.ui.tableHeaderRow;
	for (var j = 0; j < header.childNodes.length; j++) {
		switch (header.childNodes[j].id) {
			
			case 'date-col':
				tableRowString += '<TD>' + dateString + '</TD>';
				continue;
			
			case 'member-cols':
				this.firstMemberColumnIndex = j;
				for (var k = 0; k < suggestion.length; k++) {
					listItemForCurrentDate[k] = { member: suggestion[k], domNode: null };
					tableRowString += '<TD CLASS="member"></TD>';
				}
				continue;
			
			case 'warning-col':
				tableRowString += '<TD CLASS="warning"></TD>';
				continue;
			
			default:
				tableRowString += '<TD></TD>';
		}
	}
	
	var tableRow = document.createElement('TR');
	tableRow.innerHTML = tableRowString;
	tableBody.appendChild(tableRow);
	
	var instance = this;
	var memberCells = $(tableRow).find('.member');
	for (var j = 0; j < memberCells.length; j++) {
		listItemForCurrentDate[j].domNode = memberCells[j];
		this.createDraggableHtmlMemberElement(listItemForCurrentDate[j]);
		
		$(listItemForCurrentDate[j].domNode).droppable({
			scope: 'members',
//			hoverClass: 'ui-state-hover',
			tolerance: 'pointer',
//			drop: function(event, ui) { instance.handleDrop(event, ui, this); }
			drop: function (event, ui) {
				new SKGB.StegdienstListeDrop(event, ui, instance).on(this);
			}
		});
	}
}


SKGB.StegdienstListeInterface.prototype.formatDate = function (date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	return '' + year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
}


SKGB.StegdienstListeInterface.prototype.createDraggableHtmlMemberElement = function (memberObject, dragMode) {
	memberObject.domNode.innerHTML = '<DIV CLASS="ui-state-default ui-corner-all">' + memberObject.member.name + '<INPUT TYPE="hidden" NAME="id" VALUE="' + memberObject.member.id + '"></DIV>';
	var div = $(memberObject.domNode).find('DIV')[0];
	
	$(div).draggable({
		scope: 'members',
		containment: 'document',
		opacity: 1,
		distance: 0,
		revert: 'invalid',
		revertDuration: SKGB.StegdienstListeDrop.prototype.animationDuration,
//		stack: 'TABLE#stegdienst TD.member>DIV',
		helper: dragMode ? dragMode : 'original'
	});
	div.member = memberObject.member;  // :TODO: get rid of this horrible hack
	
	return div;
}


SKGB.StegdienstListeInterface.prototype.dataHasChanged = function () {
	// open question: can this function assuma that the model is already in its correct state?
	
	// dish out some warnings :)
	this.updateWarnings();
}


SKGB.StegdienstListeInterface.prototype.updateWarnings = function () {
	
	// warnings for individual dates
	for (var i = 0; i < this.liste.data.length; i++) {
		var dateItem = this.liste.data[i];
		var warningNode = this.ui.getTableWarningCellInRow(i);
		var warningClass = 'ok';
		var warningText = '';
		
		if (! dateItem[0] || ! dateItem[1]) {
			warningNode.innerHTML = '<IMG SRC="icons/warning-error.png" WIDTH=16 HEIGHT=16 ALT="Es sind zu wenige Mitglieder für diesen Termin eingeteilt." TITLE="Fehler: Es sind zu wenige Mitglieder für diesen Termin eingeteilt.">';
			continue;
		}
		
		if (dateItem[0].postcode == dateItem[1].postcode) {  // :DEBUG:
			warningClass = 'note';
			warningText = 'DIe PLZ ist gleich.';
		}
		if (dateItem[0].id == dateItem[1].id) {
			warningClass = 'error';
			warningText = 'Ein Mitglied ist mehrfach für dasselbe Datum vorgesehen.';
		}
		
		if (warningClass == 'ok') {
			warningNode.innerHTML = '<IMG SRC="icons/warning-ok.png" WIDTH=16 HEIGHT=16 ALT="">';
		}
		else if (warningClass == 'note') {
			warningNode.innerHTML = '<IMG SRC="icons/warning-note.png" WIDTH=16 HEIGHT=16 ALT="' + warningText + '" TITLE="Hinweis: ' + warningText + '">';
		}
		else if (warningClass == 'check') {
			warningNode.innerHTML = '<IMG SRC="icons/warning-caution.png" WIDTH=16 HEIGHT=16 ALT="' + warningText + '" TITLE="Warnung: ' + warningText + '">';
		}
		else if (warningClass == 'error') {
			warningNode.innerHTML = '<IMG SRC="icons/warning-error.png" WIDTH=16 HEIGHT=16 ALT="' + warningText + '" TITLE="Fehler: ' + warningText + '">';
		}
	}
	
	// warnings for individual members
	
	// other warnings (if any)
}



SKGB.StegdienstListeInterface.prototype.interactiveChange = function (change) {
	if (change.type == 'clear') {
		this.liste.assign(change.from, null);
	}
	else if (change.type == 'assign') {
		this.liste.assign(change.to, change.from);
	}
	else {  // swap
		var oldFrom = this.liste.assignment(change.from);
		var oldTo = this.liste.assignment(change.to);
		this.liste.assign(change.from, oldTo);
		this.liste.assign(change.to, oldFrom);
	}
	this.liste.stale = true;
}



// ====================================================

SKGB.StegdienstListeDrop = function (event, jQueryUi, delegate) {
	this.controller = delegate;
	// obtain references to DOM nodes
	this.prototypeContainer = this.controller.ui.memberPrototypesListNode;
	this.trashNode = this.controller.ui.trashDropTargetNode;
	this.draggable = jQueryUi.draggable.context;
	this.originContainer = jQueryUi.draggable.context.parentNode;
}
SKGB.StegdienstListeDrop.constructor = SKGB.StegdienstListeDrop;

SKGB.StegdienstListeDrop.prototype.controller = null;  // SKGB.StegdienstListeInterface instance
SKGB.StegdienstListeDrop.prototype.animationDuration = 400;  // ms
SKGB.StegdienstListeDrop.prototype.cancelled = false;


SKGB.StegdienstListeDrop.prototype.on = function (destContainer) {
	this.destContainer = destContainer;
	this.destContainerContentArray = $(this.destContainer).find('DIV');
	this.destContainerContent = this.destContainerContentArray.length > 0 ? this.destContainerContentArray[0] : null;
	
	this.analyseDragType();
	if (this.cancelled) {
		return;
	}
	
	var references = {
		origin: this.getPositionReference(this.originContainer),
		destination: this.getPositionReference(this.destContainer)
	};
	
	this.showChanges();
	this.notifyDelegate(references);
}


SKGB.StegdienstListeDrop.prototype.analyseDragType = function () {
	// cases:
	// 1: from table cell to other table cell, replacing existing member => swap
	// 2: from table cell to same table cell => cancel
	// 3: from table cell to 'trash' (stats) => remove
	// 4: from stats to empty table cell => add
	// 5: from stats, replacing existing member => remove + add
	// 6: from stats to 'trash' (stats) => cancel
	// 7: from table cell to empty table cell => move
	
	// analyse what kind of drag is happening
	this.dragFromPrototype = this.originContainer.parentNode == this.prototypeContainer;  // :FIXME: (fix what ??)
	this.dragToTrash = this.destContainer == this.trashNode;
	this.cancelDrag = this.dragFromPrototype && this.dragToTrash || this.originContainer == this.destContainer;
	this.replaceDragTarget = ! this.dragToTrash && this.destContainerContent;
//	this.dragToEmptyCell = ! this.dragToTrash && ! this.replaceDragTarget;
	
	// cancel any drag that wouldn't change state anyway
	if (this.cancelDrag) {
		this.cancelled = true;
		this.resetNodePosition(this.draggable);
		console.info('drag cancelled (case 2, 6)');
		
	}
	else if (this.dragToTrash) {
		console.info('case 3');
	}
	else {
		if (this.dragFromPrototype) {
			if (this.replaceDragTarget) {
				console.info('case 5');
			}
			else {
				console.info('case 4');
			}
		}
		else {
			if (this.replaceDragTarget) {
				console.info('case 1');
			}
			else {
				console.info('case 7');
			}
		}
	}
}


SKGB.StegdienstListeDrop.prototype.getPositionReference = function (node) {	
	var reference = {
		inTable: this.controller.ui.tableBody == node.parentNode.parentNode,
		inPrototypes: this.controller.ui.memberPrototypesListNode == node.parentNode,
		level1Index: $(node.parentNode.childNodes).index(node),
		level2Index: $(node.parentNode.parentNode.childNodes).index(node.parentNode)
	};
	if (! reference.inTable && ! reference.inPrototypes || reference.inTable && reference.inPrototypes) {
		// the DOM doesn't have the expected structure; bailing out
		return null;
	}
	
	if (reference.inTable) {
		// adjust position for other table columns
		reference.level1Index -= this.controller.firstMemberColumnIndex;
		reference.level2Index -= 1;  // huh? apparently we have a ghost row #0
	}
	else {
		reference.level2Index = -1;  // a second level is not meaningful for a list
	}
	
	return reference;
}


SKGB.StegdienstListeDrop.prototype.showChanges = function () {
	var self = this;
	
	// DOM modification and additional animation according to kind of drag
	
	if (this.dragToTrash) {  // [case 3]
		// animation
		$(this.draggable).animate({ opacity: 0 }, this.animationDuration / 2, function() {
			// remove node from DOM
			self.draggable.parentNode.removeChild(self.draggable);
		});
		
	}
	else if (this.dragFromPrototype) {  // [cases 4+5]
		// create new DOM node
		var item = { member: this.draggable.member, domNode: this.destContainer };
		var div = this.controller.createDraggableHtmlMemberElement(item);
		// animation
		$(div).animate({ opacity: 0 }, this.animationDuration / 2, function() {
			$(div).animate({ opacity: 1 }, self.animationDuration / 2);
		});
		
	}
	else {  // change within StegdienstListe table [cases 1+7]
		// move (forward)
		this.moveWithAnimation(this.draggable, this.destContainer);
		// swap (reverse)
		if (this.replaceDragTarget) {  // [case 7]
			this.moveWithAnimation(this.destContainerContent, this.originContainer);  // animate move of replaced element
		}
	}
}


SKGB.StegdienstListeDrop.prototype.moveWithAnimation = function (fromNode, toContainer) {
	var self = this;
	$(fromNode).addClass('animated');
	$(fromNode).animate({
		top: (toContainer.offsetTop - fromNode.parentNode.offsetTop),
		left: (toContainer.offsetLeft - fromNode.parentNode.offsetLeft)
	}, {
		complete: function() {
			fromNode.parentNode.removeChild(fromNode);
			$(fromNode).removeClass('animated');
			self.resetNodePosition(fromNode);
			toContainer.appendChild(fromNode);
		},
		duration: this.animationDuration
	});
}


SKGB.StegdienstListeDrop.prototype.resetNodePosition = function (fromNode) {
	fromNode.style.top = 0;
	fromNode.style.left = 0;
}


SKGB.StegdienstListeDrop.prototype.notifyDelegate = function (references) {
	
	if (this.dragToTrash) {
		this.controller.interactiveChange({
			type: 'clear',
			from: { row: references.origin.level2Index, col: references.origin.level1Index },
			to: null
		});
	}
	else if (this.dragFromPrototype) {
		this.controller.interactiveChange({
			type: 'assign',
			from: references.origin.level1Index,
			to: { row: references.destination.level2Index, col: references.destination.level1Index }
		});
	}
	else {
		this.controller.interactiveChange({
			type: 'swap',
			from: { row: references.origin.level2Index, col: references.origin.level1Index },
			to: { row: references.destination.level2Index, col: references.destination.level1Index }
		});
	}
	
	// at this point the internal business model state is (assumed to be) updated
	this.controller.dataHasChanged();
}



// ====================================================

function getMemberReference (node) {
	// better: data-* and .dataset
	var idNode = $(node).find('INPUT[name=id]').get(0);
	var id = parseInt(idNode.value);
	var members = window.params.members;
	for (var i = 0; i < members.length; i++) {
		if (members[i].id == id) {
			return members[i];
		}
	}
	return null;
}

