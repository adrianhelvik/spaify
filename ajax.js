function ajax( verb, url ) {
    return new Promise( function ( resolve, reject ) {
        var req = new XMLHttpRequest();
        verb = verb.toUpperCase();
        req.addEventListener('load', loadListener);
        req.open( verb, url );
        req.send();
        function loadListener() {
            try {
                var response = JSON.parse( this.response );
            } catch (err) {
                var response = this.response;
            }
            var result = {
                data: response,
                withCredentials: this.withCredentials,
                status: this.status,
                statusText: this.statusText,
                config: {
                    url: this.responseURL,
                    method: verb
                }
            }
            resolve( result );
        }

        setTimeout( function () {
            reject( null );
        }, 10000 );
    } );
}

function createAjaxMethod( verb ) {
    return function () {
        var args = [];
        [].forEach.call( arguments, function ( argument ) {
            args.push( argument );
        } );

        args.unshift( verb );
        return ajax.apply( null, args );
    }
}

ajax.get    = createAjaxMethod('GET');
ajax.post   = createAjaxMethod('POST');
ajax.put    = createAjaxMethod('PUT');
ajax.delete = createAjaxMethod('DELETE');
