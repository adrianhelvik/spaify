window.spaify = function ( options ) {
    'use strict';

    if ( ! Promise ) {
        console.warn( 'Your browser does not support Promise, which is required for spaify to work. Falling back to normal hrefs.' );
        return;
    }

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
        persistentElements = findPersistentElements();

        for ( var i = 0; i < links.length; i++ ) {

            if ( links[i].getAttribute( 'spa-persist' ) !== null )
                continue;

            ajaxify( links[i] );
        }

        window.onpopstate = function ( event ) {
            console.log( parseURI( location.href ).pathname );
            setTimeout( function () {
                if ( parseURI( document.location.pathname ).pathname !== parseURI( location.href ).pathname )
                    goTo( document.location.pathname, true );
            }, 500 );
        };
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
        var url = this.getAttribute( 'href' );

        if ( isIgnored( url ) )
            return;

        if ( url === '#' )
            return;

        if ( isExternal( url ) && this.getAttribute( 'spa-external' ) === null )
            return;

        event.preventDefault();

        goTo( url );
    }

    function isIgnored( url ) {
        if ( ! options || ! options.ignore )
            return;

        for ( var ignored of options.ignore ) {
            if ( parseURI( url ).pathname === parseURI( ignored ).pathname ) {
                return true;
            }
        }

        return false;
    }

    function goTo( url, replace ) {

        console.log( 'ignored:', window.spaify.ignore );

        ajax.get( url ).then( function ( response ) {
            diffAndSet( response.data )
        } ).then( update )
        .then( setState( url, replace ) );
    }

    function setState( url, replace ) {
        if ( ! replace && parseURI( url ).pathname !== parseURI( location.href ).pathname )
            history.pushState( null, url, url );

        else
            history.replaceState( null, url, url );
    }

    function diffAndSet( content ) {

        deregisterStoredLinks();
        var newDOM;

        try {
            newDOM = domParser.parseFromString( content, 'text/html' );
        } catch ( error ) {
            newDOM = domParser.parseFromString('<!DOCTYPE html><body>' + content + '</body>');
        }

        var diffs = differ.diff( document, newDOM );

        diffs = diffs.filter( function ( diff ) {
            if (diff.action === 'removeElement' && diff.element && diff.element.attributes && diff.element.attributes['spa-persist'] !== undefined) {
                return false;
            }

            return true;
        } );
        var successful = differ.apply( document, diffs );

        [].forEach.call( document.querySelectorAll( '[spa-reload]' ), function ( element ) {
            if ( element.getAttribute( 'spa-persist' ) === null ) {

                console.log( 'replacing', element );
                var parent = element.parentNode;
                var clone = Node.cloneNode( element );

                parent.removeChild( element );
                parent.appendChild( clone );
            }
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
        return {
            protocol: parser.protocol,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            hash: parser.hash,
            host: parser.host
        };
    }

    function isExternal( url ) {
        return parseURI( url ).hostname !== parseURI( '' ).hostname;
    }
}
