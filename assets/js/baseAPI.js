$.ajaxPrefilter(function(options){
    options.url='http://127.0.0.1:3007'+options.url;
})