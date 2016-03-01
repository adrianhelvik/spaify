( function () {
    spaify();

    // Use VueJS for data binding
    var app = new Vue( {
        el: 'body',
        data: {
            name: '',
            isUpdated: false
        }
    } );

    if ( localStorage.spaifyExampleData ) {
        app.$data = JSON.parse( localStorage.spaifyExampleData );
    }

    // Tell VueJS to recompile whenever the document is "reloaded"
    document.addEventListener( 'load', function () {
        app.$compile( app.$el );
    } );

    // Make the data persist when closing the page
    window.addEventListener( 'beforeunload', function () {
        app.isUpdated = true;
        localStorage.spaifyExampleData = JSON.stringify( app.$data );
    } );

} )();
