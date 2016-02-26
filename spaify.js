( function () {
    'use strict';

    if ( ! DOMParser )
        throw new Error( 'DOMParser not supported in your browser.' );

    if ( ! diffDOM )
        throw new Error( 'diffDOM is required to run spaify. Download it from github: fiduswriter/diffDOM' );

    var differ = new diffDOM();
    var domParser = new DOMParser();
    var storedLinks = [];
    var persistentElements = [];

    update();

    function update() {

        deregisterStoredLinks();

        var links = document.querySelectorAll( 'a' );
        persistentElements = [].map.call( findPersistentElements(), element => element );

        for ( let i = 0; i < links.length; i++ ) {

            if ( links[i].getAttribute( 'spa-persist' ) !== null )
                continue;

            ajaxify( links[i] );
        }
    }

    function findPersistentElements() {
        return document.querySelectorAll('[spa-persist]');
    }

    function ajaxify( link ) {
        storedLinks.push( link );
        listen( link );
    }

    function deregisterStoredLinks() {
        storedLinks.forEach( unlisten );
    }

    function clickHandler( event ) {
        if ( isExternal( this.getAttribute( 'href' ) ) && this.getAttribute( 'spa-external' ) === null ) {
            return;
        }

        event.preventDefault();

        var url = this.getAttribute( 'href' );

        ajax.get( url ).then( response => {
            deregisterStoredLinks();
            var newDOM;

            try {
                newDOM = domParser.parseFromString( response.data, 'text/html' );
            } catch ( error ) {
                newDOM = domParser.parseFromString('<!DOCTYPE html><body>' + response.data + '</body>');
            }

            var diffs = differ.diff( document, newDOM );

            diffs = diffs.filter( diff => {
                if (diff.action === 'removeElement' && diff.element && diff.element.attributes && diff.element.attributes['spa-persist'] !== undefined) {
                    return false;
                }

                return true;
            } );

            var successful = differ.apply( document, diffs );
            update();

            history.pushState( null, url, url );
        } );
    }

    function listen( link ) {
        link.addEventListener( 'click', clickHandler );
    }

    function unlisten( link ) {
        link.removeEventListener( 'click', clickHandler );
    }

    function parseURI( url ) {
        var parser = document.createElement('a');
        parser.href = url;
        return parser;
    }

    function isExternal( url ) {
        return parseURI( url ).hostname !== parseURI( '' ).hostname;
    }

} )();
