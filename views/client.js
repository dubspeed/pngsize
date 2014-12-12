$(document).ready(function() {

    function buildTable (filter_result) {
        var $table = $('#result_table'),
            $tpl = $('#tpl_row').html(),
            tpl = Handlebars.compile($tpl);

            $table.append( tpl( filter_result ) );
    }

    // connect to the website
    var socket = io.connect('http://localhost:3000');

    socket.on('filter update', function (data) {
        console.log('recived a filter result', data);
        buildTable(data);
    });

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

        var reader = new FileReader();
        reader.onload = function(evt){
            socket.emit('filter', evt.target.result);
        };

        $.each(files, function(key, value) {
            reader.readAsBinaryString(value);
        });


    }
});
