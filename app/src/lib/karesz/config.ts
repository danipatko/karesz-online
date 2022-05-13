// <...>/dotnet/shared/Microsoft.NETCore.App/VERSION
export const FRAMEWORK_VERSION =
    process.platform === 'win32' ? '6.0.3' : '6.0.2';
export const SDK_VERSION = process.platform === 'win32' ? '5.0.407' : '6.0.200';

// location of dll libraries loaded as commandline arguments
export const LIBRARY_LOCATIONS: string =
    process.platform === 'win32'
        ? `C:/Program Files/dotnet/shared/Microsoft.NETCore.App/${FRAMEWORK_VERSION}/`
        : `/usr/share/dotnet/shared/Microsoft.NETCore.App/${FRAMEWORK_VERSION}/`;

// the location of the csc compiler
export const COMPILER_LOCATION: string =
    process.platform === 'win32'
        ? `"C:/Program Files/dotnet/sdk/${SDK_VERSION}/Roslyn/bincore/csc.dll"`
        : `/usr/share/dotnet/sdk/${SDK_VERSION}/Roslyn/bincore/csc`;

export const RUNNER_DIRECTORY: string =
    process.platform === 'win32'
        ? 'C:/Users/Dani/home/Projects/karesz-online/testing'
        : '/home/dapa/Projects/karesz-online/app/test';

// necessary for the template to work
export const CRUCIAL_IMPORTS: string[] = [
    'System.Console',
    'System.Runtime',
    'System.Threading',
    'System.Collections',
    'System.Private.CoreLib',
    'System.Runtime.Extensions',
    'System.Diagnostics.Tracing',
    'System.Text.Encoding.Extensions',
];

export const MULITPLAYER_IMPORTS: string[] = [
    'System',
    'System.Linq',
    'System.Threading',
    'System.Collections.Concurrent',
    'System.Threading.Tasks.Parallel',
    // ^^^^ necessary for multithreading
];

export const SINGLEPLAYER_IMPORTS: string[] = [
    'System',
    'System.Linq',
    'System.Threading',
    'System.Collections.Generic',
    // 'System.Collections.Concurrent',
];
