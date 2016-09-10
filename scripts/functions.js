// Populate data onto dropdown
function populateDropdown() {
	// Students list
	var studentsDropdown = $('#student-list');
	for (var student in data.Students) {
		var option = '<option value="' + student + '">'
			+ student + ' '
			+ data.Students[student].firstName + ' '
			+ data.Students[student].lastName + '</option>';
		studentsDropdown.append(option);
	}
	
	// Courses list
	var coursesDropdown = $('#course-list');
	for (var course in data.Courses) {
		var option = '<option value="' + course + '">'
			+ course + ' '
			+ data.Courses[course].cname + '</option>';
		coursesDropdown.append(option);
	}
}

// Search did not match any result
var noResult = '<tr><td colspan="7"><div class="no-result">No result matching your search</div></td></tr>';

// Remove all rows from table
function resetAllRows() {
	$('#resultTable > tbody').html("");
}

// Insert data into row
function insertRow(cid, sid, fn, ln, m1, m2) {
	return '<tr>' +
				'<td><div class="regular">' + cid + '</div></td>' +
				'<td><div class="regular">' + sid + '</div></td>' +
				'<td><div class="regular">' + fn + '</div></td>' +
				'<td><div class="regular">' + ln + '</div></td>' +
				'<td><div class="regular">' + m1 + '</div></td>' +
				'<td><div class="regular">' + m2 + '</div></td>' +
				'<td><div class="regular">' + ((m1 + m2) / 2) + '</div></td>' +
			'</tr>';
}

// Variables for switching pages
var rows;
var maxRow = 10;
var curPage = 0;
var currentSortOrder = -1;
var sortDirection = 1;
var rowHeaders = [$('#cidHeader'), $('#sidHeader'), $('#fnHeader'), $('#lnHeader'), $('#m1Header'), $('#m2Header'), $('#maHeader')];
var prevBtn = $('#prevBtn');
var nextBtn = $('#nextBtn');

// Go to specific page
function toPage(pageNum) {
	if (rows.length > 0) {	
		var curIndex = pageNum * maxRow;
		var endRow = curIndex + maxRow;
		for (curIndex; curIndex < endRow; curIndex++) {
			$('#resultTable > tbody').append(rows[curIndex]);
		}
		
		// Change counter shown on top left
		var startNumber = (pageNum * maxRow) + 1;
		var endNumber = startNumber + maxRow - 1 <= rows.length ? startNumber + maxRow - 1 : rows.length;
		var counter = startNumber + ' - ' + endNumber + ' of ' + rows.length;
		$('#list-counter').html(counter);
		
		// Change page indicator
		var endPage = rows.length % maxRow == 0 ? rows.length / maxRow : Math.floor(rows.length / maxRow) + 1;
		var page_number = (pageNum + 1) + ' / ' + endPage;
		$('#page-indicator').html(page_number);
	} else {
		$('#list-counter').html('0 - 0 of 0');
		$('#page-indicator').html('1 / 1');
		$('#resultTable > tbody').append(noResult);
	}
	
	validateButtons(curPage);
}

// Enable/disable next/prev buttons
function validateButtons(pageNum) {
	// Validate prev button
	if (curPage == 0) {
		prevBtn.attr('disabled', true);
		prevBtn.css('visibility', 'hidden');
	} else {
		prevBtn.attr('disabled', false);
		prevBtn.css('visibility', 'visible');
	}
	
	// Validate next button
	var startNum = curPage * maxRow;
	if (startNum + maxRow < rows.length) {
		nextBtn.attr('disabled', false);
		nextBtn.css('visibility', 'visible');		
	} else {
		nextBtn.attr('disabled', true);
		nextBtn.css('visibility', 'hidden');		
	}
}

function prevPage() {
	curPage--;
	resetAllRows();
	toPage(curPage);
}

function nextPage() {
	curPage++;
	resetAllRows();
	toPage(curPage);
}

// Variables for arrows
var arrowAry = [];
var ARROW_ASC = 0;
var ARROW_DESC = 1;

// Set arrow visiblity base on order and direction
function setArrowVisibility(prevSortOrder, sortOrder, sortDirection) {
	// Initialize array
	if (arrowAry.length == 0) {
		arrowAry.push([$('.sortDirection.col0 .arrowAsc'), $('.sortDirection.col0 .arrowDesc')]);
		arrowAry.push([$('.sortDirection.col1 .arrowAsc'), $('.sortDirection.col1 .arrowDesc')]);
		arrowAry.push([$('.sortDirection.col2 .arrowAsc'), $('.sortDirection.col2 .arrowDesc')]);
		arrowAry.push([$('.sortDirection.col3 .arrowAsc'), $('.sortDirection.col3 .arrowDesc')]);
		arrowAry.push([$('.sortDirection.col4 .arrowAsc'), $('.sortDirection.col4 .arrowDesc')]);
		arrowAry.push([$('.sortDirection.col5 .arrowAsc'), $('.sortDirection.col5 .arrowDesc')]);
		arrowAry.push([$('.sortDirection.col6 .arrowAsc'), $('.sortDirection.col6 .arrowDesc')]);
	}
	
	// Set visibility for old order
	if (prevSortOrder != -1) {
		arrowAry[prevSortOrder][ARROW_ASC].css('visibility', 'hidden');
		arrowAry[prevSortOrder][ARROW_DESC].css('visibility', 'hidden');
	}
	
	// Set visibility for new order
	if (sortOrder != -1) {
		if (sortDirection < 0) {
			arrowAry[sortOrder][ARROW_ASC].css('visibility', 'visible');
		} else {
			arrowAry[sortOrder][ARROW_DESC].css('visibility', 'visible');
		}
	}
}

// Switching header style base on selection
function switchHeader(sortOrder) {
	var prevSortOrder = currentSortOrder;
	
	if (currentSortOrder == sortOrder) {
		sortDirection *= -1;
	} else {
		// Remove rowHeaderActive from old sort order 
		if (currentSortOrder != -1) {
			rowHeaders[currentSortOrder].removeClass('rowHeaderActive');
		}
		
		// Add rowHeaderActive to new sort order
		rowHeaders[sortOrder].addClass('rowHeaderActive');
		
		// Update order
		currentSortOrder = sortOrder;
		sortDirection = 1;
	}
	
	// Set arrow visibility
	setArrowVisibility(prevSortOrder, sortOrder, sortDirection);
}

/*
	Sort the given array
	Currently, all data will be sorted at run-time which is not ideal situation for large number of rows.
	To be able to do this more efficiently, need SQL query.
*/
function sortAry(aryToSory, sortOrder) {
	switch(sortOrder) {
		case 0:				// sortOrder 0: Course ID > First name > Last name
			aryToSort.sort(function(a, b) {
				var aFN = data.Students[a.sid].firstName;
				var aLN = data.Students[a.sid].lastName;
				var bFN = data.Students[b.sid].firstName;
				var bLN = data.Students[b.sid].lastName;

				var compareFn = (aFN.localeCompare(bFN)) * sortDirection;
				var compareLn = (aLN.localeCompare(bLN)) * sortDirection;				
				var compareCid = (a.cid.localeCompare(b.cid)) * sortDirection;				
				return a.cid != b.cid ?	compareCid
						: aFN != bFN ? compareFn
						: compareLn;
			});
			break;
		case 1:				// sortOrder 1: Student ID > Course ID
			aryToSort.sort(function(a, b) {
				var compareSid = (a.sid - b.sid) * sortDirection;
				var compareCid = (a.cid.localeCompare(b.cid)) * sortDirection;
				return a.sid != b.sid ? compareSid
						: compareCid;
			});
			break;
		case 2:				// sortOrder 2: First name > Last name > Course ID
			aryToSort.sort(function(a, b) {
				var aFN = data.Students[a.sid].firstName;
				var aLN = data.Students[a.sid].lastName;
				var bFN = data.Students[b.sid].firstName;
				var bLN = data.Students[b.sid].lastName;
				
				var compareFn = (aFN.localeCompare(bFN)) * sortDirection;
				var compareLn = (aLN.localeCompare(bLN)) * sortDirection;
				var compareCid = (a.cid.localeCompare(b.cid)) * sortDirection;
				return aFN != bFN ? compareFn
						: aLN != bLN ? compareLn
						: compareCid;
			});
			break;
		case 3:				// sortOrder 3: Last name > First name > Course ID
			aryToSort.sort(function(a, b) {
				var aFN = data.Students[a.sid].firstName;
				var aLN = data.Students[a.sid].lastName;
				var bFN = data.Students[b.sid].firstName;
				var bLN = data.Students[b.sid].lastName;
				
				var compareFn = (aFN.localeCompare(bFN)) * sortDirection;
				var compareLn = (aLN.localeCompare(bLN)) * sortDirection;
				var compareCid = (a.cid.localeCompare(b.cid)) * sortDirection;
				return aLN != bLN ? compareLn
						: aFN != bFN ? compareFn
						: compareCid;
			});
			break;
		case 4:				//sortOrder 4: Course ID > Mark 1 > First name
			aryToSort.sort(function(a, b) {
				var aFN = data.Students[a.sid].firstName;
				var bFN = data.Students[b.sid].firstName;
				
				var compareCid = (a.cid.localeCompare(b.cid)) * sortDirection;
				var compareMark1 = (a.mark1 - b.mark1) * sortDirection;
				var compareFn = (aFN.localeCompare(bFN)) * sortDirection;
				return a.cid != b.cid ? compareCid
						: a.mark1 != b.mark1 ? compareMark1
						: compareFn;
			});			
			break;
		case 5:				//sortOrder 5: Course ID > Mark 2 > First name
			aryToSort.sort(function(a, b) {
				var aFN = data.Students[a.sid].firstName;
				var bFN = data.Students[b.sid].firstName;
				
				var compareCid = (a.cid.localeCompare(b.cid)) * sortDirection;
				var compareMark2 = (a.mark2 - b.mark2) * sortDirection;
				var compareFn = (aFN.localeCompare(bFN)) * sortDirection;
				return a.cid != b.cid ? compareCid
						: a.mark2 != b.mark2 ? compareMark2
						: compareFn;
			});			
			break;
		case 6:				//sortOrder 6: Course ID > Average > First name
			aryToSort.sort(function(a, b) {
				var aFN = data.Students[a.sid].firstName;
				var bFN = data.Students[b.sid].firstName;
				var aAvg = (a.mark1 + a.mark2) / 2;
				var bAvg = (b.mark1 + b.mark2) / 2;
				
				var compareCid = (a.cid.localeCompare(b.cid)) * sortDirection;
				var compareAvg = (aAvg - bAvg) * sortDirection;
				var compareFn = (aFN.localeCompare(bFN)) * sortDirection;
				return a.cid != b.cid ? compareCid
						: aAvg != bAvg ? compareAvg
						: compareFn;
			});
			break;
		default: break;
	}
}

// Search from using search button
function clickSearch() {
	curPage = 0;
	if (currentSortOrder == 0) currentSortOrder = -1;
	search(0);
}

/*
	Search function
	sortOrder -1: order based on entry added
	sortOrder 0: Course ID > Student ID
	sortOrder 1: Student ID > Course ID
	sortOrder 2: First name > Last name > Course ID
	sortOrder 3: Last name > First name > Course ID
	sortOrder 4: Course ID > Mark 1 > First name
	sortOrder 5: Course ID > Mark 2 > First name
	sortOrder 6: Course ID > Average > First name
 */
function search(sortOrder) {
	// initiate
	resetAllRows();
	rows = [];
	aryToSort = [];
	var studentFilter = $('#student-list').val();
	var courseFilter = $('#course-list').val();
	
	// Go through the filter
	for (var key in data.Marks) {
		var cid = data.Marks[key].cid;
		var sid = data.Marks[key].sid;
		
		// Check filter
		var courseCondition = courseFilter.length > 0 ? jQuery.inArray(cid, courseFilter) >= 0 : true;
		var studentCondition = studentFilter.length > 0 ? jQuery.inArray('' + sid, studentFilter) >=0 : true;
		
		// if the both id is in the filter
		if (studentCondition && courseCondition) {
			aryToSort.push(data.Marks[key]);
		}
	}
	
	// Switch row number
	maxRow = parseInt($('#display-list').val());
	
	// Switch Header
	switchHeader(sortOrder);
	
	// Sort
	sortAry(aryToSort, sortOrder);
	
	// Push to row
	var i;
	for (i = 0; i < aryToSort.length; i++) {
		var cid = aryToSort[i].cid;
		var sid = aryToSort[i].sid;
		var m1 = aryToSort[i].mark1;
		var m2 = aryToSort[i].mark2;
		rows.push(insertRow(cid, sid, data.Students[sid].firstName, data.Students[sid].lastName, m1, m2));
	}
	
	// Update back to first page
	toPage(curPage);
}