import Ember from 'ember';
import layout from '../../templates/components/ui-table/th';

import Styleable from '../../mixins/styleable';
import Composable from '../../mixins/composable';

import { swapNodes } from '../../utils/dom';
import { construct } from '../../utils/computed';

/**
 * @private
 * @module ui
 * @class ui-table.th
 */
export default Ember.Component.extend(Styleable, Composable, {
  componentRegistrationName: 'th',
  classNames: 'ui-table__th',
  classNameBindings: ['columnClass', 'isLeafHeader:ui-table__th--leaf:ui-table__th--branch'],
  layout,

  /**
   * @attribute width
   */
  width: '1fr',
  /**
   * @attribute frozen
   */
  frozen: false,

  /**
   * @attribute span
   * @deprecated Use `width` with `fr` unit instead
   */
  span: Ember.computed({
    get() {
      Ember.deprecate('th#span is deprecated. Use th#width with `fr` unit instead');
    },

    set() {
      Ember.deprecate('th#span is deprecated. Use th#width with `fr` unit instead');
    }
  }),

  // @private
  table: null,
  // @private
  thead: null,
  // @private
  th: null,
  // attrs }

  columnClass: Ember.computed.readOnly('elementId'),

  childHeaderList: construct(Ember.A).readOnly(),

  isLeafHeader: Ember.computed.empty('childHeaderList'),

  frozenMirrorCellNode: Ember.computed(function() {
    return document.createComment(`frozen-mirror-${this.get('elementId')}`);
  }).readOnly(),

  frozenMirrorCell: Ember.computed('frozenMirrorCellNode', function() {
    return Ember.$(this.get('frozenMirrorCellNode'));
  }).readOnly(),

  willInsertElement() {
    this._super(...arguments);

    let childHeaderList = this.get('childHeaderList');

    this.$().on('register.th', (evt, th) => {
      evt.preventDefault();
      evt.stopPropagation();

      childHeaderList.pushObject(th);
    });
    this.$().on('resize', Ember.run.bind(this, function(evt, ui) {
      this.set('width', ui.size.width);
      this.get('thead').resizeWidth();
    }));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().off('register.th');
    this.$().off('resize');
  },

  columnWidth: Ember.computed({
    get() {
      Ember.assert('th#columnWidth needs to be set');
    },

    set(key, value) {
      let ns = this.get('table.elementId');
      let cls = this.get('columnClass');

      if (value === null) {
        this.style(`#${ns} .${cls}`, {
          display: 'none',
          width: `${value}px`
        });
      }
      else {
        this.style(`#${ns} .${cls}`, {
          width: `${value}px`
        });
      }

      return value;
    }
  }),

  freeze() {
    let isLeaf = this.get('isLeafHeader');

    if (!isLeaf) {
      return;
    }

    let mirror = this.get('frozenMirrorCell');

    if (mirror.parent().is('.ui-table__froze')) {
      swapNodes(this.element, mirror);
    }
  },

  unfreeze() {
    let isLeaf = this.get('isLeafHeader');

    if (!isLeaf) {
      return;
    }

    let mirror = this.get('frozenMirrorCell');

    if (!mirror.parent().is('.ui-table__froze')) {
      swapNodes(this.element, mirror);
    }
  }
});
