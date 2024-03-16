import Scenarist from '@faddys/scenarist';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { Console } from 'node:console';
import { createInterface } from 'node:readline';
import { parse } from 'node:path';
import dns from 'node:dns/promises';

const $$ = Symbol .for;
const { dir } = parse ( new URL ( import .meta .url ) .pathname );

export default class Controller {

constructor () {

const controller = this;

controller .receiver = createServer ();

const { stdin, stdout, stderr } = controller .engine = spawn ( 'csound', [ '-Lstdin', `${ dir }/../engine/index.csd` ] );

controller .input = new Console ( stdin );
controller .output = createInterface ( { input: stdout } );

}

$_producer ( $, { stamp } ) {

const controller = this;

controller .stamp = stamp;

controller .receiver .on ( 'request', ( ... details ) => $ ( $$ ( 'process' ), ... details ) );
controller .receiver .on ( 'error', error => console .error ( error .stack ) );
controller .receiver .on ( 'listening', () => $ ( $$ ( 'inform' ) ) );

controller .output .on ( 'error', error => console .error ( error .stack ) );
controller .output .on ( 'line', async line => {

try {

await $ ( ... line .trim () .split ( /\s+/ ) );

} catch ( _ ) {}

} );

controller .engine .on ( 'close', () => controller .receiver .close () );

}

$_listen ( $, port ) {

this .receiver .listen ( port );

}

async $_process ( $, request, response ) {

let code = 200;
let message = 'OK';
let content = '';

try {

const controller = this;
const method = request .method .toLowerCase ();
let { pathname, hash } = new URL ( request .url, `${ request .headers .protocol }://${ request .headers .host }` );
const { $: $processor, resolution } = await $ (

... ( pathname = pathname .slice ( 1 ) ) .length ? pathname .split ( '/' ) : []

);

content = resolution;

} catch ( error ) {

code = 400;
message = 'Bad Request';
content = error instanceof Error ? error .stack : error;

}

response .writeHead ( code, message, { 'Content-Type': 'text/plain' } );
response .end ( content, 'utf8' );

}

async $_inform () {

const controller = this;
const { port } = controller .receiver .address ();
const URLs = ( await dns .getServers () ) .map ( address => `http://${ address }:${ port }` )

console .log ( 'Listening at:\n', URLs .join ( '\n' ) );

}

$_director ( $, direction ) {

throw `Invalid direction '${ direction || '' }'`;

}

$_score ( $, instrument, ... parameters ) {

const controller = this;
const reference = 'oscilla-' + Date .now ();

controller .input .log ( `i "${ instrument }" 0 0 "${ reference }" ${ parameters .join ( ' ' ) }` );

return new Promise ( response => {

controller [ '$' + reference ] = ( $, ... message ) => response ( message .join ( ' ' ) );

} );

}

async $exit ( $ ) {

return ( await $ ( $$ ( 'score' ), 'exit' ) ) .resolution;

}

async $tempo ( $, value = 60 ) {

return ( await $ ( $$ ( 'score' ), 'clock_tempo', value ) ) .resolution;

}

};
