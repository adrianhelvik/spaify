window.spaify = function ( options ) {
    'use strict';

    if ( options && options.ignore && typeof options.ignore === 'string' )
        options.ignore = [ options.ignore ];

    start();

    var differ;
    var domParser;
    var storedLinks;
    var persistentElements;
    var mutationTimeout;
    var observer;
    var events = {};
    var currentUrl;

    function start() {

        if ( ! Promise ) {
            console.warn( 'Your browser does not support Promise, which is required for spaify to work. Falling back to normal hrefs.' );
            return;
        }

        if ( ! DOMParser ) {
            console.warn( 'Your browser does not support DOMParser, which is required for spaify to work. Falling back to normal hrefs.' );
            return;
        }

        if ( ! diffDOM )
            throw new Error( 'diffDOM is required to run spaify. Download it from github: fiduswriter/diffDOM' );

        differ = new diffDOM();
        domParser = new DOMParser();
        storedLinks = [];
        persistentElements = [];
        currentUrl = document.location.pathname;

        window.addEventListener( 'popstate', function () {
            if ( parseURI( document.location.pathname ).pathname !== parseURI( currentUrl ).pathname )
                goTo( document.location.pathname, true );
        } );

        document.addEventListener( 'click', clickHandler );
    }

    function clickHandler( event ) {
        if ( event.target.tagName !== 'A' ) {
            return;
        }

        var url = event.target.getAttribute( 'href' );

        if ( isIgnored( url ) )
            return;

        if ( url.charAt( '#' ) )
            return;

        if ( isExternal( url ) && event.target.getAttribute( 'spa-external' ) === null )
            return;

        var success = goTo( url );

        if ( success )
            event.preventDefault();
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
        var success = true;

        ajax.get( url )
        .then( diffAndSet, function ( error ) { success = false; } )
        .then( function() { setState( url, replace ) } )
        .then( emitLoad )
        .then( emitReady )
        .catch( function() {
            location.href = url;
            success = false;
        } );

        if ( ! success ) {
            return false;
        }

        currentUrl = url;
        return true;
    }

    function emitLoad() {
        var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
        window.dispatchEvent( evt );
        document.dispatchEvent( evt );
    }

    function emitReady() {
        var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
        window.dispatchEvent( evt );
        document.dispatchEvent( evt );
    }

    function setState( url, replace ) {
        if ( ! replace && parseURI( url ).pathname !== parseURI( location.href ).pathname )
            history.pushState( null, url, url );

        else
            history.replaceState( null, url, url );
    }

    function diffAndSet( response ) {

        if ( response.status.toString().charAt( 0 ) !== '2' ) {
            throw new Error( 'Not found.' );
        }

        var content = response.data;

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

        differ.apply( document, diffs );
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
