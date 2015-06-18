// user list data array for filling in info box
var userListData = [];

$(document).ready(function() {
	populateTable();

	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	$('#userList table tbody').on('click', 'td a.linkupdateuser', showEditPanel);
	$('#updateUser input').on('change', function(){$(this).addClass('updated')});
	$('#btnUpdateUser').on('click', updateUser);
	$('#btnCancelUpdate').on('click', function() {
		$('.edit-panel').hide();
		$('.add-panel').show();
	});
});

// functions
function populateTable() {
	var tableContent = '';

	$.getJSON('/users/userlist', function(data) {

		userListData = data;

		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a>/<a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
			tableContent += '</tr>';
		});

		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(event) {
	// prevent link from firing
	event.preventDefault();

	var thisUserName = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username }).indexOf(thisUserName);

	var thisUserObject = userListData[arrayPosition];
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
}

function addUser(event) {
	event.preventDefault();

	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if ($(this).val() === '') {
			errorCount++;
		}
	});

	if (errorCount === 0) {
		var newUser = {
			'username' : $('#addUser fieldset input#inputUserName').val(),
			'email' : $('#addUser fieldset input#inputUserEmail').val(),
			'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
			'age' : $('#addUser fieldset input#inputUserAge').val(),
			'location' : $('#addUser fieldset input#inputUserLocation').val(),
			'gender' : $('#addUser fieldset input#inputUserGender').val()
		}

		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response) {
			if (response.msg === '') {
				$('#addUser fieldset input').val('');
				populateTable();
			} else {
				alert('Error: ' + response.msg);
			}
		});
	} else {
		alert('Please fill in all fields');
		return false;
	}
}

function deleteUser(event) {
	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete this user?');
	if (confirmation === true) {
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response) {
			if (response.msg ==- '') {

			} else {
				alert('Error: ' + response.msg);
			}
			populateTable();
		});
	} else {
		return false;
	}
}

function showEditPanel() {
	console.log('showing');
	$('.add-panel').hide();
	$('.edit-panel').show();

	var _id = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id }).indexOf(_id);

	var thisUserObject = userListData[arrayPosition];
	$('#updateUser fieldset input#inputUserName').val(thisUserObject.username);
	$('#updateUser fieldset input#inputUserEmail').val(thisUserObject.email);
	$('#updateUser fieldset input#inputUserFullname').val(thisUserObject.fullname);
	$('#updateUser fieldset input#inputUserAge').val(thisUserObject.age);
	$('#updateUser fieldset input#inputUserLocation').val(thisUserObject.location);
	$('#updateUser fieldset input#inputUserGender').val(thisUserObject.gender);

	$('#updateUser').attr('rel', thisUserObject._id);
}

function updateUser(event){
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to update this user?');

  // Check and make sure the user confirmed
  if (confirmation === true) {
    // If they did, do our update

    //set the _id of the user to be update
    var _id = $(this).parentsUntil('div').parent().attr('rel');

    //create a collection of the updated fields
    var fieldsToBeUpdated = $('#updateUser input.updated');

    //create an object of the pairs
    var updatedFields = {};
    $(fieldsToBeUpdated).each(function(){
      var key = $(this).attr('placeholder').replace(" ","").toLowerCase();
      var value = $(this).val();
      updatedFields[key]=value;
    });

    // do the AJAX
    $.ajax({
      type: 'PUT',
      url: '/users/updateuser/' + _id,
      contentType: 'application/json',
      data: JSON.stringify(updatedFields)
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
        // togglePanels();
      } else {
        alert('Error: ' + response.msg);
      }
      // Update the table
      populateTable();
      $('.edit-panel').hide();
      $('.add-panel').show();
    });
  }
  else {

    // If they said no to the confirm, do nothing
    return false;
  }
};