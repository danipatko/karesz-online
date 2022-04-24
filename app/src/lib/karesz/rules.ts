export interface Replacement {
    name: string;
    args?: string;
    usefn: boolean;
    replace: RegExp;
}

export interface Rule {
    find: RegExp;
    replace: string | null;
    severity: 'error' | 'warning';
    description: string;
    reverse?: boolean;
}

export const REPLACE: Replacement[] = [
    // replace with field values
    {
        usefn: false,
        replace: /(?<value>([a-zA-Z]+\s[a-zÁ-Űá-űA-Z_\d]+\s*\(.*\)[\n\s]*\{))/g,
        name: 'static $1',
    },
    {
        usefn: false,
        replace: /fekete/g,
        name: '2',
    },
    {
        usefn: false,
        replace: /piros/g,
        name: '3',
    },
    {
        usefn: false,
        replace: /zöld/g,
        name: '4',
    },
    {
        usefn: false,
        replace: /sárga/g,
        name: '5',
    },
    // other
    {
        usefn: true,
        replace: /Lépj\s*\(\s*\)/g,
        name: 'Step',
    },
    {
        usefn: true,
        replace: /Fordulj_balra\s*\(\s*\)/g,
        name: 'Turn',
        args: '-1',
    },
    {
        usefn: true,
        replace: /Fordulj_jobbra\s*\(\s*\)/g,
        name: 'Turn',
        args: '1',
    },
    {
        usefn: true,
        replace: /Fordulj\s*\((?<value>.*)\)/g,
        name: 'Turn',
        args: '$1',
    },
    {
        usefn: true,
        replace: /Vegyél_fel_egy_kavicsot\s*\(\s*\)/g,
        name: 'PickUpRock',
    },
    {
        usefn: true,
        replace: /Tegyél_le_egy_kavicsot\s*\(\s*\)/g,
        name: 'PlaceRock',
    },
    {
        usefn: true,
        replace: /Tegyél_le_egy_kavicsot\s*\((?<value>.*)\)/g,
        name: 'PlaceRock',
        args: '$1',
    },
    {
        usefn: true,
        replace: /Északra_néz\s*\(\s*\)/g,
        name: 'AmILookingAt',
        args: '0',
    },
    {
        usefn: true,
        replace: /Délre_néz\s*\(\s*\)/g,
        name: 'AmILookingAt',
        args: '2',
    },
    {
        usefn: true,
        replace: /Keletre_néz\s*\(\s*\)/g,
        name: 'AmILookingAt',
        args: '1',
    },
    {
        usefn: true,
        replace: /Nyugatra_néz\s*\(\s*\)/g,
        name: 'AmILookingAt',
        args: '3',
    },
    {
        usefn: true,
        replace: /Hol_vagyok\s*\(\s*\)/g,
        name: 'WhereAmI',
    },
    {
        usefn: true,
        replace: /Merre_néz\s*\(\s*\)/g,
        name: 'WhereAmILooking',
    },
    {
        usefn: true,
        replace: /Van_e_itt_kavics\s*\(\s*\)/g,
        name: 'IsAnyThingUnder',
    },
    {
        usefn: true,
        replace: /Mi_van_alattam\s*\(\s*\)/g,
        name: 'WhatIsUnder',
    },
    {
        usefn: true,
        replace: /Van_e_előttem_fal\s*\(\s*\)/g,
        name: 'IsThereAWall',
    },
    {
        usefn: true,
        replace: /Kilépek_e_a_pályáról\s*\(\s*\)/g,
        name: 'AmISteppingOut',
    },
    {
        usefn: true,
        replace: /Radar\s*\(\s*\)/g,
        name: 'Radar',
    },
    {
        usefn: true,
        replace: /Scan\s*\(\s*\)/g,
        name: 'Scan',
    },
    {
        usefn: true,
        replace: /Kihagy\s*\(\s*\)/g,
        name: 'Omit',
    },
    // replace with turn values
    {
        usefn: false,
        replace: /jobbra/g,
        name: '1',
    },
    {
        usefn: false,
        replace: /balra/g,
        name: '-1',
    },
];

// TODO: impose more rules
export const RULES: Rule[] = [
    {
        find: /Main|Environment|Exit|FailFast|throw|new\s+Exception|using|global|Imports|namespace|System\./g,
        severity: 'error',
        description: 'disallowed keyword',
        replace: null,
    },
    {
        find: /void\s+FELADAT\s*\(\s*\)/g,
        severity: 'error',
        description: 'missing entry',
        replace: null,
        reverse: true,
    },
    {
        find: /Thread|Threading|AbandonedMutexException|ApartmentState|AsyncFlowControl|AsyncLocal|AsyncLocalValueChangedArgs|AutoResetEvent|Barrier|BarrierPostPhaseException|CancellationToken|CancellationTokenRegistration|CancellationTokenSource|CompressedStack|ContextCallback|CountdownEvent|EventResetMode|EventWaitHandle|ExecutionContext|HostExecutionContext|HostExecutionContextManager|Interlocked|IOCompletionCallback|IThreadPoolWorkItem|LazyInitializer|LazyThreadSafetyMode|LockCookie|LockRecursionException|LockRecursionPolicy|ManualResetEvent|ManualResetEventSlim|Monitor|Mutex|NativeOverlapped|Overlapped|ParameterizedThreadStart|PeriodicTimer|PreAllocatedOverlapped|ReaderWriterLock|ReaderWriterLockSlim|RegisteredWaitHandle|Semaphore|SemaphoreFullException|SemaphoreSlim|SendOrPostCallback|SpinLock|SpinWait|SynchronizationContext|SynchronizationLockException|Thread|Thread|Constructors|Properties|Methods|ThreadAbortException|ThreadExceptionEventArgs|ThreadExceptionEventHandler|ThreadInterruptedException|ThreadLocal|ThreadPool|ThreadPoolBoundHandle|ThreadPriority|ThreadStart|ThreadStartException|ThreadState|ThreadStateException|Timeout|Timer|TimerCallback|Volatile|WaitCallback|WaitHandle|WaitHandleCannotBeOpenedException|WaitHandleExtensions|WaitOrTimerCallback/g,
        severity: 'error',
        description: 'threading is disallowed',
        replace: null,
    },
    {
        find: /while\s*\(true\)/g,
        severity: 'warning',
        description: 'possibly blocking code',
        replace: null,
    },
    {
        find: /Step|Turn|AmISteppingOut|WhereAmI|WhereAmILooking|IsThereAWall|PickUpRock|PlaceRock|WhatIsUnder|IsAnyThingUnder|Radar|Scan|Omit/g,
        severity: 'error',
        description: 'function may interfere with template',
        replace: null,
    },
];
