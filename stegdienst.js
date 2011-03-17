
if (! window.SKGB) { window.SKGB = {}; }


window.config = {
	markWeekDay: 3,  // Wednesday
	summerStart: {month: 2, day: 15}, // March
	summerEnd: {month: 9, day: 31}  // October
};


// model
SKGB.StegdienstListe = function () {
	this.data = [];
	this.firstDate = null;
}
SKGB.StegdienstListe.constructor = SKGB.StegdienstListe;


SKGB.StegdienstListe.prototype.setDateRange = function (suggestionDates) {
	if (this.data.length != suggestionDates.length) {
		if (this.firstDate != null) { throw 'Not implemented.'; }
		this.data = new Array(suggestionDates.length);
	}
	this.firstDate = suggestionDates.start;
}


/*
SKGB.StegdienstListe.prototype.insertNewDataRow = function (data, afterRow) {
	if (afterRow < this.data.length - 1) { throw 'Not implemented.'; }
	throw 'Not implemented.';
}


SKGB.StegdienstListe.prototype.removeDataRow = function (row) {
	throw 'Not implemented.';
}
*/


SKGB.StegdienstListe.prototype.setDataPoint = function (data, row, col) {
	this.data[row][col] = data;
}


SKGB.StegdienstListe.prototype.generateSuggestions = function (members, dates, membersPerDate) {
//	var list = new Array(dates.length);
	for (var dateIndex = 0, memberIndex = 0; dateIndex < dates.length; dateIndex++) {
		this.data[dateIndex] = new Array(membersPerDate);
		for (var i = 0; i < membersPerDate; i++, memberIndex++) {
			if (memberIndex >= members.length) {
				memberIndex = 0;  // the 'strategy': just reset the member's list when it has been run through
			}
			this.data[dateIndex][i] = members[memberIndex];
		}
	}
}


function addMember (member, node) {
}


function removeMember (node) {
}


function getMemberReference (node) {
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


function getDataReference (node) {
	
}


// onload:
$(function(){
	// Tabs
	$('#tabs').tabs();
	
	var paramsSource = $('#initdata').get(0).innerHTML;
	eval('window.params = ' + paramsSource);
	
	generateStatistics();
	
	$('#generate-suggestion-button').click(function(){
		generateSuggestions();
	});
	
	generateSuggestions();
});


function generateStatistics () {
	var statListNode = $('#statistics>UL')[0];
	var members = window.params.members;
	for (var i = 0; i < members.length; i++) {
		var item = { member: members[i], domNode: document.createElement('LI') };
		createDraggableHtmlMemberElement(item, 'clone');
		statListNode.appendChild(item.domNode);
	}
	$('#statistics').droppable({
		scope: 'members',
//		hoverClass: 'ui-state-hover',
		tolerance: 'pointer',
		drop: handleDrop
	});
}


function generateSuggestions () {
	var params = window.params;
	var config = window.config;
	
	var dates = getSuggestionDates(config);
	SKGB.stegdienstListe = new SKGB.StegdienstListe();
	SKGB.stegdienstListe.setDateRange(dates);
	
	var membersHeader = $('TABLE#stegdienst TR:first-child>TH#members-col')[0];
	var membersPerDate = membersHeader.colSpan;
	
	// actually generate those suggestions
	SKGB.stegdienstListe.generateSuggestions(params.members, dates, membersPerDate);
	var data = SKGB.stegdienstListe.data;
	
	// add suggestions to UI table
	var date = dates.start;
	for (var i = 0; i < data.length; i++) {
		createDomTableRowNodes(data[i], date);
		date.setDate(date.getDate() + 7);
	}
	
	$('#tabs').tabs('select', 1);
}


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


function createDomTableRowNodes (suggestion, date) {
	var tableBody = $('TABLE#stegdienst>TBODY')[0];
	
	var listItemForCurrentDate = new Array(suggestion.length);
	var tableRowString = '<TD>' + formatDate(date) + '</TD>';
	for (var j = 0; j < suggestion.length; j++) {
		listItemForCurrentDate[j] = { member: suggestion[j], domNode: null };
		tableRowString += ' <TD CLASS="member"></TD>';
	}
	
	var tableRow = document.createElement('TR');
	tableRow.innerHTML = tableRowString + ' <!--TD-->';
	tableBody.appendChild(tableRow);
	
	var memberCells = $(tableRow).find('.member');
	for (var j = 0; j < memberCells.length; j++) {
		listItemForCurrentDate[j].domNode = memberCells[j];
		createDraggableHtmlMemberElement(listItemForCurrentDate[j]);
		
		$(listItemForCurrentDate[j].domNode).droppable({
			scope: 'members',
//			hoverClass: 'ui-state-hover',
			tolerance: 'pointer',
			drop: handleDrop
		});
	}
}


function createDraggableHtmlMemberElement (memberObject, dragMode) {
	memberObject.domNode.innerHTML = '<DIV CLASS="ui-state-default ui-corner-all">' + memberObject.member.name + '<INPUT TYPE="hidden" NAME="id" VALUE="' + memberObject.member.id + '"></DIV>';
	var div = $(memberObject.domNode).find('DIV')[0];
	$(div).draggable({
		scope: 'members',
		containment: 'document',
		opacity: 1,
		revert: 'invalid',
		revertDuration: 300,
		stack: 'TABLE#stegdienst TD.member>DIV',
		helper: dragMode ? dragMode : 'original'
	});
	div.member = memberObject.member;  // :TODO: get rid of this horrible hack
}


function handleDrop (event, ui) {
	var animationDuration = 300;  // ms
	
	// cases:
	// 1: from table cell to other table cell, replacing existing member => swap
	// 2: from table cell to same table cell => cancel
	// 3: from table cell to 'trash' (stats) => remove
	// 4: from stats to empty table cell => add
	// 5: from stats, replacing existing member => remove + add
	// 6: from stats to 'trash' (stats) => cancel
	// 7: from table cell to empty table cell => move
	
	// obtain references to DOM nodes
	var statisticsContainer = $('#statistics')[0];
	var trashNode = statisticsContainer;
	var draggable = ui.draggable.draggable('widget')[0];
	var originContainer = draggable.parentNode;
	var destContainer = this;
	var destContainerContentArray = $(destContainer).find('DIV');
	var destContainerContent = destContainerContentArray.length > 0 ? destContainerContentArray[0] : null;
	
	// analyse what kind of drag is happening
	var dragFromPrototype = originContainer.parentNode.parentNode == statisticsContainer;  // :FIXME:
	var dragToTrash = destContainer == statisticsContainer;
	var cancelDrag = dragFromPrototype && dragToTrash || originContainer == destContainer;
	var replaceDragTarget = ! dragToTrash && destContainerContent;
	var dragToEmptyCell = ! dragToTrash && ! replaceDragTarget;
	
	// cancel any drag that wouldn't change state anyway
	if (cancelDrag) {
console.info('drag cancelled (case 2, 6)');
		// animate move back to origin position
		animateRelativeMove(draggable, originContainer, animationDuration);
		return;
	}
	
	// animate move to destination position
	animateRelativeMove(draggable, destContainer, animationDuration);
	
	// DOM modification and additional animation according to kind of drag
	
	if (dragToTrash) {
console.info('case 3');
		setTimeout(function() {
			removeMember(originContainer);
			originContainer.removeChild(draggable);
		}, animationDuration * 1.2);  // :BUG: danger of race condition; we'd better use a call-back here
		
	}
	else {
		if (replaceDragTarget) {
			if (dragFromPrototype) {
console.info('case 5');
				animateRelativeMove(destContainerContent, trashNode, animationDuration);  // animate move of replaced element
				setTimeout(function() {
					destContainer.removeChild(destContainerContent)
					var item = { member: draggable.member, domNode: destContainer };
					createDraggableHtmlMemberElement(item);
				}, animationDuration * 1.2);  // :BUG: danger of race condition; we'd better use a call-back here
			}
			else {
console.info('case 1');
				animateRelativeMove(destContainerContent, originContainer, animationDuration);  // animate move of replaced element
				setTimeout(function() {
					addMember(getMemberReference(originContainer), destContainer);
					addMember(getMemberReference(destContainer), originContainer);
					originContainer.removeChild(draggable);
					destContainer.removeChild(destContainerContent)
					originContainer.appendChild(destContainerContent);
					destContainer.appendChild(draggable);
				}, animationDuration * 1.2);  // :BUG: danger of race condition; we'd better use a call-back here
			}
		}
		else {
			if (dragFromPrototype) {
console.info('case 4');
				setTimeout(function() {
					var item = { member: draggable.member, domNode: destContainer };
					createDraggableHtmlMemberElement(item);
				}, animationDuration * 1.2);  // :BUG: danger of race condition; we'd better use a call-back here
			}
			else {
console.info('case 7');
				setTimeout(function() {
					originContainer.removeChild(draggable);
					destContainer.appendChild(draggable);
				}, animationDuration * 1.2);  // :BUG: danger of race condition; we'd better use a call-back here
			}
		}
	}
	
}


function addMemberBlobToList (memberObject) {
	
}


function removeMemberBlobFromList () {
	
}


function animateRelativeMove (fromNode, toContainer, duration) {
	$(fromNode).animate({
		top: (toContainer.offsetTop - fromNode.parentNode.offsetTop),
		left: (toContainer.offsetLeft - fromNode.parentNode.offsetLeft)
	}, duration);
	// the animation's positioning isn't always quite exact, so we need to reset the relative CSS positioning
	setTimeout(function() {
		fromNode.style.top = 0;
		fromNode.style.left = 0;
	}, duration * 1.2);  // :BUG: danger of race condition; we'd better use a call-back here
}


function formatDate (date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	return '' + year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
}
