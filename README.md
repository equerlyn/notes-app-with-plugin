folder api digunakan untuk menampung banyak folder yang merupakan Hapi plugin. Untuk kebutuhan saat ini, kita cukup membuat satu plugin saja, yakni notes.

Di dalam setiap folder plugin (contohnya notes) akan terdiri dari tiga buah berkas JavaScript, yakni handler.js, index.js, dan routes.js.

Berkas index.js merupakan tempat di mana kita membuat plugin Hapi itu sendiri. Lalu bagaimana dengan routes.js dan handler.js? Tentu Anda sudah tahu fungsinya kan? Yap! Keduanya digunakan untuk mendefinisikan route /notes (routes.js) dan menampung function handler pada route /notes (handler.js). Kedua berkas tersebut (routes.js dan handler.js) tentu akan digunakan oleh berkas index.js.