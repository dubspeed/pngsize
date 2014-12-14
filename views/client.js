$(document).ready(function() {

    function getTpl (name) {
        return Handlebars.compile($("#"+name).html());
    }

    // connect to the website
    var socket = io.connect('http://localhost:3000');

    var result_count = 0;
    socket.on('filter update', function (data) {
        console.log('recived a filter result', data);
        $('#result_table').append(getTpl('tpl_row')(data));
        $('.carousel-inner').append(getTpl('tpl_car_item')(data));
        $('.carousel-inner .item').removeClass('active').first().addClass('active');
        $('.carousel-indicators').append(getTpl('tpl_car_indicator')({ nr: result_count }));
        $('.carousel-indicators li').removeClass('active').first().addClass('active');
        result_count += 1;
        $('#carousel-results').carousel();
    });

    socket.on('hello', function(data) {
        console.log('hello! filters are', data);
        $('#filters_list').html(getTpl('tpl_filters')({
            filters: data
        }));
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
