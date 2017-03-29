import Ember from 'ember';

/**
 * Utilities that provide integration with `ember-microstates`
 *
 * @private
 */
export default Object.freeze({
  // TODO handle list
  // TODO handle object
  // TODO handle select
  // TODO handle string
  isMicrostate(object) {
    if (object === null) {
      return false;
    }

    if (typeof object === 'object') {
      let asPrimitive = object.valueOf();

      if (typeof asPrimitive !== 'object' && typeof object.set === 'function') {
        return true;
      }
    }

    return false;
  },

  toggle(object, key) {
    let oldValue = Ember.get(object, key);

    Ember.run.join(() => {
      if (this.isMicrostate(oldValue)) {
        oldValue.toggle();
      }
      else {
        object.set(key, !oldValue);
      }
    });
  },

  set(object, key, newValue) {
    let oldValue = Ember.get(object, key);

    Ember.run.join(() => {
      if (this.isMicrostate(oldValue)) {
        oldValue.set(newValue);
      }
      else {
        object.set(key, newValue);
      }
    });
  }
});
