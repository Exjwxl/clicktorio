export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, new Set());
        }
        this.events.get(eventName).add(callback);
    }

    off(eventName, callback) {
        if (this.events.has(eventName)) {
            this.events.get(eventName).delete(callback);
        }
    }

    emit(eventName, data) {
        if (this.events.has(eventName)) {
            for (const callback of this.events.get(eventName)) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            }
        }
    }

    // Remove all listeners for an event
    removeAllListeners(eventName) {
        if (eventName) {
            this.events.delete(eventName);
        } else {
            this.events.clear();
        }
    }

    // Get the number of listeners for an event
    listenerCount(eventName) {
        return this.events.has(eventName) ? this.events.get(eventName).size : 0;
    }

    // Get all registered event names
    eventNames() {
        return Array.from(this.events.keys());
    }
}
