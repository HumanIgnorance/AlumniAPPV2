// Tiny external store that tracks in-flight *mutating* requests (POST / PUT /
// PATCH / DELETE). axiosConfig.jsx reports start/end here; AsyncButton listens
// so that a button which triggered a request shows a loading spinner until
// that request finishes — without every call site having to wire up its own
// `loading` state.
let nextId = 1;
const active = new Set();
const listeners = new Set();

const emit = (event) => {
    listeners.forEach((fn) => {
        try {
            fn(event);
        } catch (e) {
            /* a bad listener must never break a request */
        }
    });
};

export const requestTracker = {
    start() {
        const id = nextId++;
        active.add(id);
        emit({ type: "start", id, count: active.size });
        return id;
    },
    end(id) {
        if (!active.delete(id)) return;
        emit({ type: "end", id, count: active.size });
    },
    count: () => active.size,
    subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
};

export default requestTracker;
