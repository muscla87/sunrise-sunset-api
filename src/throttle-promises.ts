export default async function ThrottlePromises<T>(listOfCallableActions: (() => Promise<T>)[], concurrencyLimit: number): Promise<T[]> {
    // We'll need to store which is the next promise in the list.
    let i = 0;
    let resultArray = new Array<T>(listOfCallableActions.length);

    // Now define what happens when any of the actions completes. Javascript is
    // (mostly) single-threaded, so only one completion handler will call at a
    // given time. Because we return doNextAction, the Promise chain continues as
    // long as there's an action left in the list.
    function doNextAction() {
        if (i < listOfCallableActions.length) {
            // Save the current value of i, so we can put the result in the right place
            let actionIndex = i++;
            let nextAction = listOfCallableActions[actionIndex];
            return Promise.resolve(nextAction())
                .then(result => {  // Save results to the correct array index.
                    resultArray[actionIndex] = result;
                    return;
                }).then(doNextAction);
        }
    }

    // Now start up the original <limit> number of promises.
    // i advances in calls to doNextAction.
    let listOfPromises = [];
    while (i < concurrencyLimit && i < listOfCallableActions.length) {
        listOfPromises.push(doNextAction());
    }

    await Promise.all(listOfPromises)
    return resultArray;
}