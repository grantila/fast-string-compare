/**
 * Compare two strings. This comparison is not linguistically accurate, unlike
 * String.prototype.localeCompare(), albeit stable.
 *
 * @returns -1, 0 or 1
 */
export function compare( a: string, b: string )
{
	const lenA = a.length;
	const lenB = b.length;
	const minLen = lenA < lenB ? lenA : lenB;
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
