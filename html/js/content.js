(function(){    
    function sanitize(input){
        output = input.replace(/&/gm, '&amp;')
            .replace(/</gm, '&lt;').replace(/>/gm, '&gt;');              
        return output;
    };
    
    $(document).ready(function() {
        $.ajax({ 
            url: 'https://raw.githubusercontent.com/devwerks/XSS-Cheatsheet/master/vectors.json', 
            dataType: 'json',
            success: function (data) { 
                $.each(data, function(index, element) {
                    $('#content').append('<div class="item"><a href="#' + element.id + '">#' + element.id + '</a><code class="data">' + sanitize(element.data) + '</code></div>');
                });
            }
        });
    });
})();
