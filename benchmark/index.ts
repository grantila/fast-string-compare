import { readFileSync } from 'fs'

import * as Benchmark from "benchmark"
import { RBTree } from 'bintrees'


const manyWordsRaw: Array< string > =
	readFileSync( __dirname + '/words.txt', 'utf-8' )
	.split( '\n' )
	.sort( ( a, b ) => a.localeCompare( b ) );

const typesWordsRaw: Array< string > =
	readFileSync( __dirname + '/babel-types.txt', 'utf-8' )
	.split( '\n' )
	.sort( ( a, b ) => a.localeCompare( b ) );


const compareLocaleCompare = ( a: string, b: string ) =>
	a.localeCompare( b );

function compareFast( a: string, b: string )
{
	const lenA = a.length;
	const lenB = b.length;
	const minLen = Math.min( lenA, lenB );
	var i = 0;
	for ( ; i < minLen; ++i )
	{
		const ca = a.charCodeAt( i );
		const cb = b.charCodeAt( i );

		if ( ca > cb )
			return 1;
		else if ( ca < cb )
			return -1;
	}
	if ( lenA === lenB )
		return 0;
	return lenA > lenB ? 1 : -1;
};

const compareFastDouble = ( a: string, b: string ) =>
{
	const lenA = a.length;
	const lenB = b.length;
	const minLen = lenA < lenB ? lenA : lenB;
	const chunkLen = minLen & ~1;
	var i = 0;
	for ( i = 0; i < chunkLen; i += 2 )
	{
		const ca = a.charCodeAt( i ) << 16 | a.charCodeAt( i + 1 );
		const cb = b.charCodeAt( i ) << 16 | b.charCodeAt( i + 1 );

		if ( ca > cb )
			return 1;
		else if ( ca < cb )
			return -1;
	}
	for ( ; i < minLen; ++i )
	{
		const ca = a.charCodeAt( i );
		const cb = b.charCodeAt( i );

		if ( ca > cb )
			return 1;
		else if ( ca < cb )
			return -1;
	}

	return lenA === lenB ? 0 : lenA > lenB ? 1 : -1;
};

const compareFastAndSlice = ( a: string, b: string ) =>
{
	const lenA = a.length;
	const lenB = b.length;
	const minLen = Math.min( lenA, lenB );
	const chunkLen4 = ( minLen >> 2 ) << 2;
	var i = 0;
	for ( ; i < chunkLen4; i += 4 )
	{
		if ( a.slice( i, i + 4 ) !== b.slice( i, i + 4 ) )
			break;
	}
	for ( ; i < minLen; ++i )
	{
		const ca = a.charCodeAt( i );
		const cb = b.charCodeAt( i );

		if ( ca > cb )
			return 1;
		else if ( ca < cb )
			return -1;
	}
	if ( lenA === lenB )
		return 0;
	return lenA > lenB ? 1 : -1;
};

function compareFastCodePoint( a: string, b: string )
{
	const lenA = a.length;
	const lenB = b.length;
	const minLen = Math.min( lenA, lenB );
	for ( let i = 0; i < minLen; ++i )
	{
		const ca = a.codePointAt( i )!;
		const cb = b.codePointAt( i )!;

		if ( ca > cb )
			return 1;
		else if ( ca < cb )
			return -1;
	}
	if ( lenA === lenB )
		return 0;
	return lenA > lenB ? 1 : -1;
};

const compareBuffered = ( a: string, b: string ) =>
{
	const ba = Buffer.from( a, 'latin1' );
	const bb = Buffer.from( b, 'latin1' );
	return ba.compare( bb );
};

// zxx seems to be the fastest
const compareIntl = new Intl.Collator( 'zxx', { usage: 'sort' } ).compare;


function runRawTest(
	data: Array< string >,
	compare: typeof compareLocaleCompare,
	index: number
)
{
	compare(
		data[ index % data.length ],
		data[ ( index + 1 ) % data.length ]
	);
}

function runSortTest(
	data: Array< string >,
	compare: typeof compareLocaleCompare
)
{
	[ ...data ].sort( compare );
}

function runTreeTest(
	data: Array< string >,
	compare: typeof compareLocaleCompare
)
{
	const tree = new RBTree( compare );

	data.forEach( val =>
	{
		tree.insert( val );
	} );

	data.forEach( ( val, i ) =>
	{
		if ( i % 3 === 0 )
			tree.remove( val );
	} );

	data.forEach( ( val, i ) =>
	{
		if ( i % 2 === 0 )
			tree.insert( val );
	} );

	data.forEach( val =>
	{
		tree.find( val );
	} );
}

function runBenchmark( )
{
	const manyWordsReversed: Array< string > =
		manyWordsRaw.reverse( );
	const manyWordsRandomized: Array< string > =
		manyWordsRaw.sort( ( a, b ) => Math.random( ) * 2 - 1 );

	const typesWordsReversed: Array< string > =
		typesWordsRaw.reverse( );
	const typesWordsRandomized: Array< string > =
		typesWordsRaw.sort( ( a, b ) => Math.random( ) * 2 - 1 );

	const inputs = [
		{ name: 'english words', data: manyWordsRaw },
		{ name: 'english words reversed', data: manyWordsReversed },
		{ name: 'english words randomized', data: manyWordsRandomized },
		{ name: 'data type words', data: typesWordsRaw },
		{ name: 'data type words reversed', data: typesWordsReversed },
		{ name: 'data type words randomized', data: typesWordsRandomized },
	];

	// Unused
	compareBuffered;

	const comparators = [
		{ name: 'fast          ', comparator: compareFast },
		{ name: 'fast double   ', comparator: compareFastDouble },
		{ name: 'fast and slice', comparator: compareFastAndSlice },
		{ name: 'fast codepoint', comparator: compareFastCodePoint },
		// This is just *too* slow to include
		// { name: 'as buffer     ', comparator: compareBuffered },
		{ name: 'Intl.Collator ', comparator: compareIntl },
		{ name: 'localeCompare ', comparator: compareLocaleCompare },
	];

	function runTestKind(
		name: string,
		data: Array< string >,
		fn: typeof runRawTest
	)
	{
		const suite = new Benchmark.Suite( name );

		console.log( `\nRunning test of: ${name}` );

		let i = 0;
		comparators.forEach( ( { name, comparator } ) =>
			suite.add( name, ( ) =>
			{
				fn( data, comparator, ++i );
			} )
		);

		suite.on( "cycle", ( event: Benchmark.Event ) =>
		{
			console.log( event.target.toString( ) );
		} );

		suite.run( { async: false } );
	}

	console.log( `Benchmarking raw comparison algorithms...` );
	runTestKind(
		'raw compare',
		manyWordsRandomized,
		runRawTest
	);
	console.log( );

	console.log( `Benchmarking comparison algorithms for sort...` );
	inputs.forEach( ( { name, data } ) =>
	{
		runTestKind( name, data, runSortTest );
	} );
	console.log( );

	console.log( `Benchmarking comparison algorithms for trees...` );
	inputs.forEach( ( { name, data } ) =>
	{
		runTestKind( name, data, runTreeTest );
	} );
}

runBenchmark( );
