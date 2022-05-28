// <...>/dotnet/shared/Microsoft.NETCore.App/VERSION
export const FRAMEWORK_VERSION =
    process.platform === 'win32' ? '6.0.3' : '6.0.3';
export const SDK_VERSION = process.platform === 'win32' ? '5.0.407' : '6.0.201';

// location of dll libraries loaded as commandline arguments
export const LIBRARY_LOCATIONS: string =
    process.platform === 'win32'
        ? `C:/Program Files/dotnet/shared/Microsoft.NETCore.App/${FRAMEWORK_VERSION}/`
        : `/usr/share/dotnet/shared/Microsoft.NETCore.App/${FRAMEWORK_VERSION}/`;

// the location of the csc compiler
export const COMPILER_LOCATION: string =
    process.platform === 'win32'
        ? `"C:/Program Files/dotnet/sdk/${SDK_VERSION}/Roslyn/bincore/csc.dll"`
        : `/usr/share/dotnet/sdk/${SDK_VERSION}/Roslyn/bincore/csc.dll`;

export const RUNNER_DIRECTORY: string =
    process.platform === 'win32'
        ? 'C:/Users/Dani/home/Projects/karesz-online/testing'
        : '/home/testing';

// necessary, loaded from cmd
export const CRUCIAL_IMPORTS: string[] = [
    'System',
    'System.Console',
    'System.Runtime',
    'System.Threading',
    'System.Collections',
    'System.Private.CoreLib',
    'System.Runtime.Extensions',
    'System.Diagnostics.Tracing',
    'System.Text.Encoding.Extensions',
];

// dll names
export const MULITPLAYER_DLL: string[] = [
    'System.Linq',
    'System.Threading',
    'System.Collections',
    'System.Collections.Concurrent',
    'System.Threading.Tasks.Parallel',
    // ^^^^ necessary for multithreading
];

// imported with 'using'
export const MULITPLAYER_IMPORTS: string[] = [
    'System',
    'System.Linq',
    'System.Threading',
    'System.Threading.Tasks',
    'System.Collections.Generic',
    'System.Collections.Concurrent',
];

export const SINGLEPLAYER_DLL: string[] = [
    'System.Linq',
    'System.Threading',
    'System.Collections',
];

export const SINGLEPLAYER_IMPORTS: string[] = [
    'System',
    'System.Linq',
    'System.Threading',
    'System.Collections.Generic',
];
