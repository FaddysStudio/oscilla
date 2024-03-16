#!/usr/bin/env node

import Scenarist from '@faddys/scenarist';
import Controller from './controller/index.js';
import { request } from 'node:http';

const $$ = Symbol .for;

export default await Scenarist ( {

host: 'localhost',
port: 1313,

$_producer ( $ ) {

$ ( ... process .argv .slice ( 2 ) );

},

$_director ( $, ... args ) {

const { host, port } = this;

request (

`http://${ host }:${ port }/${ args .join ( '/' ) }`,
response => {

let content = '';

response .setEncoding ( 'utf8' );
response .on ( 'data', data => ( content += data ) );
response .on ( 'end', () => console .log ( response .statusMessage + '!', content ) );

}

) .on ( 'error', error => console .error ( error .message ) )
.end ();

},

$on ( $ ) {

const oscilla = this;

oscilla .$_director = new Controller;

$ ( $$ ( 'listen' ), oscilla .port );

}

} );
