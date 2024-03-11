#!/usr/bin/env node

import Scenarist from '@faddys/scenarist';
import { spawn } from 'node:child_process';
import { parse } from 'node:path';

const { dir } = parse ( new URL ( import .meta .url ) .pathname );

export default await Scenarist ( {

$_producer ( $ ) {

$ ( ... process .argv .slice ( 2 ) );

},

get [ '$-p' ] () { return this [ '$--port' ] },

[ '$--port' ] ( $, ... args ) {

return $ ( Symbol .for ( 'parameter' ), 'port', ... args );

},

get [ '$-k' ] () { return this [ '$--kit' ] },

[ '$--kit' ] ( $, ... args ) {

return $ ( Symbol .for ( 'parameter' ), 'kit', ... args );

},

parameter: {

port: 1313

},

$_parameter ( $, name, value, ... args ) {

if ( ! value ?.length )
throw`${ name } is missing.`;

this .parameter [ name ] = value;

return $ ( ... args );

},

$_director ( $, ... args ) {

if ( args .length )
if ( args [ 0 ] ?.startsWith ( '--' ) )
return $ ( ... args .shift () .split ( '=' ), ... args );

else if ( args [ 0 ] ?.startsWith ( '-' ) )
return $ ( args [ 0 ] .slice ( 0, 2 ), ... ( args [ 0 ] .length > 2 ? [ args .shift () .slice ( 2 ) ] : [] ), ... args );

const { parameter } = this;
const { kit } = parameter;

spawn ( 'csound', [

`${ dir }${ kit ? '/' + kit : '' }/index.csd`,
... Object .keys ( parameter ) .map ( name => `--omacro:${ name }=${ parameter [ name ] }` )

], {

detached: true,
stdio: 'ignore'

} ) .unref ();

}

} );
