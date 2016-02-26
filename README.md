Spaify
======

Simply add the following to the bottom of your index page:

```html
<script spa-persist src="ajax.js"></script>
<script spa-persist src="diffDOM.js"></script>
<scirt spa-persist src="spaify.js">
```

.. and all \<a\> tags will trigger a get request that only
replaces the changed parts of the DOM instead of applying
a full page reload.

Licence
=======

For spaify.js and ajax.js
-------------------------

ISC. See https://tldrlegal.com/license/-isc-license

Copyright (c) 2016, Adrian Helvik

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

For diffDOM (not my work)
-------------------------

LGPL v. 3. See https://github.com/fiduswriter/diffDOM for more details.
