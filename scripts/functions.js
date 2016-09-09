var noResult = '<tr><td colspan="6"><div class="no-result">No result matching your search</div></td></tr>';

function resetAllRows() {
	$('#resultTable > tbody').html("");
}

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
var firstRun = false;
var rows;
var maxRow = 10;
var curPage;
var prevBtn = $('#prevBtn');
var nextBtn = $('#nextBtn');

function toPage(pageNum) {
	if (rows.length > 0) {	
		resetAllRows();
		
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
		$('#resultTable > tbody').append(noResult);
	}
	
	validateButtons(curPage);
}

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
	toPage(curPage);
}

function nextPage() {
	curPage++;
	toPage(curPage);
}

function search() {
	rows = [];
	if (!firstRun) {
		firstRun = true;
		for (var key in data.Marks) {
			var cid = data.Marks[key].cid;
			var sid = data.Marks[key].sid;
			var m1 = data.Marks[key].mark1;
			var m2 = data.Marks[key].mark2;
			var candidate;
			for (var student in data.Students) {
				if (student == sid) {
					candidate = student;
					break;
				}
			}
			rows.push(insertRow(cid, sid, data.Students[candidate].firstName, data.Students[candidate].lastName, m1, m2));
		}
		curPage = 0;
	} else {
		
	}
	
	toPage(curPage);
}