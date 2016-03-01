Spaify
======

Simply add the following to the bottom of your pages:

```html
<script src="ajax.js"></script>
<script src="diffDOM.js"></script>
<script src="spaify.js"></script>
<script>
    spaify();
</script>
```

.. and all `<a>` tags will trigger a get request that only
replaces the changed parts of the DOM instead of applying
a full page reload.

### the spa-persist attribute

If you want an element to persist when navigating to another
page, you can add the attribute `spa-persist`. This can be
useful in combination with the ignore option...

### The ignore option

If you do not want links to a given path on your domain to
behave like normal hrefs you can supply an ignore option
as either an array or string like so:
```javascript
spaify( { ignore: '/some-page' } );

spaify( { ignore: [ '/some-page', '/some-other-page' ] } );
```

How to run the example
======================

* clone the repo
* download npm and
* run `npm install --global serve`
* cd into the root of the project (not the example directory)
* run the command `serve`
* open example, then open index.jade

Licence
=======

For spaify.js and ajax.js
-------------------------

ISC. See https://tldrlegal.com/license/-isc-license

Copyright (c) 2016, Adrian Helvik

Permission to use, copy, modify, and/or distribute this
software for any purpose with or without fee is hereby granted,
provided that the above copyright notice and this permission
notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING
FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING
OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
OF THIS SOFTWARE.

For diffDOM (not my work)
-------------------------

LGPL v. 3. See https://github.com/fiduswriter/diffDOM for more details.
