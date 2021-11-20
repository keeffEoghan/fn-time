/**
 * Simple time-stepping - frame, real-time, constant-step - via any API.
 */

export const steps = {
    diff: '-', dt: '-', '⏳': '-',
    pause: 0, '⏸': 0,
    add: '+', '⏭': '+'
};

export const stepDef = steps.diff;
export const startDef = 0;
export const nowDef = { [steps.diff]: Date.now, [steps.add]: 1e3/60 };

/**
 * Sets up properties needed to track time, starts/steps time in various ways:
 * - Time-difference or time-advance stepping.
 * - Step forwards or backwards in time or pause it.
 * - Current time can be a number or function; or the object's fixed time-step.
 * - Override property, pass the result to new objects.
 *
 * @example
 *     // Initial call sets up properties.
 *     const diff0 = timer({ step: '-' }, 200);
 *     // => { step: '-', time: 200, dt: 200 };
 *     const add0 = timer({ step: 200 });
 *     // => { step: 200, time: 200, dt: 200 };
 *
 *     // Subsequent calls advance time and track difference.
 *
 *     // No time difference here.
 *     timer(diff0, 200); // => { step: '-', time: 200, dt: 0 };
 *     timer(add0, 0); // => { step: 200, time: 200, dt: 0 };
 *
 *     // Time-difference here with a change or step, into a new result target.
 *     const diff1 = timer(diff0, 300, {});
 *     // => { step: '-', time: 300, dt: 100 };
 *     const add1 = timer(add0, null, {});
 *     // => { step: 200, time: 400, dt: 200 };
 *
 *     diff1.time-diff0.time === diff1.dt; // => true;
 *     add1.time-add0.time === add1.dt; // => true;
 *
 * @param {object} state The state being tracked.
 * @param {number} [state.time=startDef] The initial time.
 * @param {string|number} [state.step=stepDef] How time advances:
 *     - Difference since last `time`: `'diff'`/`'dt'`/`'-'`/`'⏳'`.
 *     - Pause: `'pause'`/`'⏸'`, or number zero (`0`).
 *     - Add `time` step: `'add'`/`'+'`/`'⏭'`, or non-zero number (step size).
 * @param {number|function} [now] The time now (clock/frame/step/etc), or a
 *     function giving it; if not given, uses `state.step` if numeric or
 *     `nowDef[state.step]` otherwise.
 * @param {object|false} [out=state] The state to set up; modifies `state` if
 *     not given.
 *
 * @returns {object|number} The given `out` set up with its initial `time`; or
 *     if `out` is falsey, returns the relevant calculated unknown value:
 *     - The difference since last `time` for `diff` step.
 *     - The updated `time` for `add` or `pause` step.
 */
export function timer(state, now, out = state) {
    // Get the initial time and step-step.
    const { time: t0 = startDef, step = stepDef } = state;
    // Get the step mode - from a key into `steps` or a numerical value.
    const s = (steps[step] ?? step);
    const diff = (s === steps.diff);
    const t = (now ?? nowDef[s] ?? s);

    // Step by `s`:
    // - `0` or falsey to `pause`
    // - `steps.diff` for difference since last `time`
    // - `steps.add` or a number to add a `time` step
    const t1 = ((!s)? t0 : ((diff)? 0 : t0)+((isNaN(t))? t() : t));
    const dt = t1-t0;

    // If only returning a value, return the relevant calculated unknown.
    if(!out) { return ((diff)? dt : t1); }

    out.time = t1;
    out.dt = dt;
    out.step = step;

    return out;
}

export default timer;
