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
var noResult = '<tr><td colspan="6"><div class="no-result">No result matching your search</div></td></tr>';

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
			'</tr>';
}

// Variables for switching pages
var rows;
var maxRow = 10;
var curPage = 0;
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

// Search from using search button
function clickSearch() {
	curPage = 0;
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
	
	// Sort
	switch(sortOrder) {
		case 0:				// sortOrder 0: Course ID > Student ID
			aryToSort.sort(function(a, b) {
				var compareSid = a.sid - b.sid;
				var compareCid = a.cid.localeCompare(b.cid);					
				return a.cid != b.cid ?	compareCid
						: compareSid;
			});
			break;
		case 1:				// sortOrder 1: Student ID > Course ID
			aryToSort.sort(function(a, b) {
				var compareSid = a.sid - b.sid;
				var compareCid = a.cid.localeCompare(b.cid);
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
				
				var compareFn = aFN.localeCompare(bFN);
				var compareLn = aLN.localeCompare(bLN);
				var compareCid = a.cid.localeCompare(b.cid);
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
				
				var compareFn = aFN.localeCompare(bFN);
				var compareLn = aLN.localeCompare(bLN);
				var compareCid = a.cid.localeCompare(b.cid);
				return aLN != bLN ? compareLn
						: aFN != bFN ? compareFn
						: compareCid;
			});
			break;
		case 4:				//sortOrder 4: Course ID > Mark 1 > First name
			aryToSort.sort(function(a, b) {
				var aFN = data.Students[a.sid].firstName;
				var bFN = data.Students[b.sid].firstName;
				
				var compareCid = a.cid.localeCompare(b.cid);
				var compareMark1 = a.mark1 - b.mark1;
				var compareFn = aFN.localeCompare(bFN);
				return a.cid != b.cid ? compareCid
						: a.mark1 != b.mark1 ? compareMark1
						: compareFn;
			});			
			break;
		case 5:				//sortOrder 5: Course ID > Mark 2 > First name
			aryToSort.sort(function(a, b) {
				var aFN = data.Students[a.sid].firstName;
				var bFN = data.Students[b.sid].firstName;
				
				var compareCid = a.cid.localeCompare(b.cid);
				var compareMark2 = a.mark2 - b.mark2;
				var compareFn = aFN.localeCompare(bFN);
				return a.cid != b.cid ? compareCid
						: a.mark2 != b.mark2 ? compareMark2
						: compareFn;
			});			
			break;
		default: break;
	}
	
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