$(document).ready(function() {

    function buildTable (event, data) {
        var $table = $('#result_table'),
            $tpl = $('#tpl_row').html(),
            tpl = Handlebars.compile($tpl);

        for (var filter_name in data) {
            var url = data[filter_name];
            $table.append( tpl({
                url: url
            }) );
        }
    }

    //Variable to store your files
    var files;

    // Add events
    $('input[type=file]').on('change', prepareUpload);

    // Grab the files and set them to our variable
    function prepareUpload(event) {
        files = event.target.files;
        console.log('added', files);
    }

    $('#upload').on('submit', uploadFiles);

    function uploadFiles(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening

        if (!files) {
            console.log('no files');
            return;
        }

        var data = new FormData();

        $.each(files, function(key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: '/',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                if(typeof data.error === 'undefined') {
                    // Success so call function to process the form
                    buildTable(event, data);
                    console.log(data);
                } else {
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('ERRORS: ' + textStatus);
            }
        });
    }
});
