<div class="col-sm-6 col-md-4"  >
<div class="thumbnail">
    <a href="{{url}}" target="_blank"><img src="{{ url }}" alt="{{filter}}"></a>
    <div class="caption">
        <h3>{{ filter }}</h3>
        <p>Filesize: {{ size }} bytes</p>
        <p>Time elapsed: {{ time }} ms</p>
        <p>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#output-{{filter}}">Output</button>
        </p>
    </div>
</div>
</div>
