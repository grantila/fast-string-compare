import { readFileSync } from 'fs'
import * as path from 'path'

import { compare } from './index'

const wordsFile = path.resolve( __dirname, '../benchmark/words.txt' );
const words: Array< string > =
	readFileSync( wordsFile, 'utf-8' )
	.split( '\n' )
	.sort( ( ) => Math.random( ) * 2 - 1 )
	.slice( 0, 10000 );

// Add some duplicates
words.splice( 5000, 0, ...words.slice( 100, 200 ) );

const defaultCompare = ( a: string, b: string ) => a.localeCompare( b );

describe( "fast-string-compare", ( ) =>
{
	it( "should do the same as localeCompare for english", ( ) =>
	{
		const reshuffled = [ ...words ].sort( ( ) => Math.random( ) * 2 - 1 );

		const sort1 = [ ...words ].sort( defaultCompare );
		const sort2 = [ ...words ].sort( compare );
		const sort3 = [ ...reshuffled ].sort( compare );

		expect( sort2 ).toStrictEqual( sort3 );

		const sort2locale = [ ...sort2 ].sort( defaultCompare );

		expect( sort2locale ).toStrictEqual( sort1 );
	} );
} );
