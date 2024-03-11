#!/usr/bin/env node

import Scenarist from '@faddys/scenarist';
import { spawn } from 'node:child_process';
import { parse } from 'node:path';

const $$ = Symbol .for;
const { dir } = parse ( new URL ( import .meta .url ) .pathname );
const _port = '1313';

export default await Scenarist ( {

$_producer ( $ ) {

$ ( ... process .argv .slice ( 2 ) );

},

score: [],
scale: [ 'c', 'd', 'e', 'f', 'g', 'a', 'b' ],

$_director ( $, ... args ) {

if ( args .length === 0 )
return $ ( Symbol .for ( 'score' ) );

const oscilla = this;

if ( ! oscilla .instrument ) {

oscilla .instrument = args .shift ();
oscilla .beat = parseFloat ( args .shift () );

if ( isNaN ( oscilla .beat )

}

const parameters = args .shift () .split ( '' );

switch ( parameters .length ) {

case 1:

if ( ! oscilla .scale .includes ( parameters ) )
throw `Invalid note key: ${ parameters [ 0 ] }. Use a key from the following scale: ${ Object .keys ( oscilla .scale ) .join ( ' ' ) }.`;

{

key: parameters [ 0 ],
duration: 1,
delay: oscilla .score .length * oscilla .beat

}

return $ ( ... args );

},

$_score () {

const oscilla = this;

oscilla .score .forEach ( note => oscilla .send ( note ) );

},

$on ( $, port = _port ) {

spawn ( 'csound', [

`${ dir }/receiver.csd`,
`--omacro:port=${ port }`

], {

detached: true,
stdio: 'ignore'

} ) .unref ();

},

$off ( $, port = _port ) {

this .send ( { instrument: 'exit' } );

},

$tempo ( $, parameters ) {

this .send ( {

instrument: 'tempo',
parameters

} );

},

send ( note ) {

note = {

instrument: note .instrument || 'synthesizer',
instance: note .instance || '.00',
delay: note .delay || '0',
duration: note .duration || '0'

};

const csound = spawn ( 'csound', [

`${ dir }/sender.csd`,
... Object .keys ( note ) .map ( parameter => `--omacro:${ parameter }=${ score [ parameter ] }` )

] );

csound .stdout .pipe ( process .stdout );
csound .stderr .pipe ( process .stderr );

}

} );
