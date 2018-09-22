(function(){    
    function sanitize(input){
        var output = input.replace(/&/gm, '&amp;')
            .replace(/</gm, '&lt;').replace(/>/gm, '&gt;');              
        return output;
    }
    
    $(document).ready(function() {
        $.ajax({ 
            url: 'https://raw.githubusercontent.com/devwerks/XSS-Cheatsheet/master/vectors.json', 
            dataType: 'json',
            success: function (data) { 
                $.each(data, function(index, element) {
                    $('#content').append('<li><div class="item"><a id="' + element.id + '"></a><a href="#' + element.id + '">#' + element.id + '</a> <a target="_blank" href="editor.html#' + element.id + '">Editor</a><code class="data">' + sanitize(element.data) + '</code></div></li>');
                });
                $('#content li').wrap('<ul/>');
            }
        });
        $.ajax({ 
            url: 'https://raw.githubusercontent.com/devwerks/XSS-Cheatsheet/master/events.json', 
            dataType: 'json',
            success: function (data) { 
                $.each(data, function(index, element) {
                    $('#events').append('<li><div class="item"><a id="event' + element.id + '"></a><a href="#event' + element.id + '">#' + element.id + '</a> <a target="_blank" href="editor.html#event' + element.id + '">Editor</a><code class="data">' + sanitize(element.data) + '</code></div></li>');
                });
                $('#events li').wrap('<ul/>');
            }
        });
    });
})();
