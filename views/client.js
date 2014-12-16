$(document).ready(function() {

    function getTpl (name) {
        return Handlebars.compile($("#"+name).html());
    }

    // connect to the website
    var socket = io.connect('http://localhost:3000');

    var result_count = 0;
    socket.on('filter update', function (data) {
        console.log('recived a filter result', data);
        var sorted_data = data;
        // link a output modal
        $('.modals').append(getTpl('tpl_filter_output')(data));
        $('#output-' + data.filter + ' .stdout').html(data.output.stdout.replace(/\n/gi, '<br>'));
        // add a result entry
        $('#result_table').append(getTpl('tpl_row')(sorted_data));
        // update the carousel
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

    var files = $('input[type=file]')[0].files;

    // Add events
    $('input[type=file]').on('change', prepareUpload);

    // Grab the files and set them to our variable
    function prepareUpload(event) {
        files = event.target.files;
    }

    $('#upload').on('submit', uploadFiles);

    function uploadFiles(event) {
        event.stopPropagation();
        event.preventDefault();

        if (!files) {
            $('.alerts').append(getTpl('tpl_alert-no-files')());
            return;
        }

        $('#alert-no-files').remove();


        $.each(files, function(key, value) {
            var reader = new FileReader();
            reader.onload = function(evt){
                console.log('sending', value.name);
                socket.emit('filter', evt.target.result);
            };
            reader.readAsBinaryString(value);
        });

    }
});
