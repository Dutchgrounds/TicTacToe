/// <binding ProjectOpened='sass:watch' />
'use strict';
const { dest, src, watch, task, parallel, series } = require( 'gulp' );
const { sass } = require( '@mr-hope/gulp-sass' );
const cleanCss = require( 'gulp-clean-css' );

const cached = require( 'gulp-cached' );

var isolatedFolders = [
    './Pages/**/*.scss',
    './Shared/**/*.scss'
];
var sharedFolders = [
    './Styles/**/*.scss'
];

task( 'sass-shared',
    function()
    {
        return src( './Styles/Site.scss' )
            .pipe( sass( ).on( 'error', sass.logError ) )
            .pipe( cleanCss( ) )
            .pipe( dest( './wwwroot/css' ) );
    } );

task( 'sass-isolated',
    function()
    {
        return src( isolatedFolders )
            .pipe( sass( ).on( 'error', sass.logError ) )
            .pipe( cleanCss( ) )
            .pipe( cached( 'sass_compile' ) )
            .pipe( dest( function( file )
            {
                return file.base;
            } ) );
    } );

function sassWatchShared()
{
    return watch( sharedFolders, series( 'sass-shared' ) );
};

function sassWatchIsolated()
{
    return watch( isolatedFolders, series( 'sass-isolated' ) );
};

task( 'sass:watch', parallel( sassWatchIsolated, sassWatchShared ) );