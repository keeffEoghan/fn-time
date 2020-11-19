/**
 * Simple time-stepping - frame, real-time, constant-step - via any API.
 */

export const steps = {
    diff: -1, pause: 0, add: 1,
    '📏': -1, '⏸': 0, add: '⏭',
    '-1': -1, '0': 0, '1': 1,
    '-': -1, '0': 0, '+': 1
};

export const stepDef = steps.add;
export const startDef = 0;
export const timeDef = 1000/60;

/**
 * Sets up properties needed to track time, starts/steps time in various ways.
 *
 * @param {object} state The state being tracked.
 * @param {number} [state.time=startDef] The initial time.
 * @param {string|number} [state.step=stepDef] How time advances:
 *     - Adding a time-step (`steps.add`/`'-'`, or a positive number).
 *     - Pausing (`steps.pause`/`'-'`, or `0`).
 *     - Diff from the latest time (`steps.diff`/`'-'`, or a negative number).
 * @param {number|function} [time=timeDef] The time (clock/frame/etc), or a
 *     function giving it; current time or time-step, according to `state.step`.
 * @param {object|false} [out=state] The state to set up; modifies `state` by
 *     default; or if falsey, returns the relevant calculated time value:
 *     - The latest time if add-stepping forwards, or paused.
 *     - The time-difference if diff-stepping from the latest time.
 *
 * @returns {object|number} The given `out` set up with its initial time; or if
 *     `out` is falsey, returns the initial time.
 */
export function timer(state, time = timeDef, out = state) {
    // Get the initial time and step-step.
    const { time: t0 = startDef, step = stepDef } = state;
    // Get the step mode - from a key into `steps` or a numerical value.
    const d = ((step in steps)? steps[step] : step);
    // Step the time - '0' pauses; '+' adds a time-step; '-' sets time, to diff.
    const t1 = ((!d)? t0 : ((d > 0)? t0 : 0)+((isNaN(time))? time() : time));
    const dt = t1-t0;

    // If only returning a value, return the unknown one as calculated:
    // - The latest time if add-stepping forwards, or paused.
    // - The time-difference if diff-stepping from the latest time.
    if(!out) { return ((d >= 0)? t1 : dt); }

    out.time = t1;
    out.dt = dt;

    return out;
}

export default timer;
