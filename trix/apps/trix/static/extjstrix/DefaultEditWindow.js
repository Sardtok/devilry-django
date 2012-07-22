/** Default config for the Create New window, which is opened to create an item
 * in the admin interface. */
Ext.define('trix.DefaultEditWindow', {
    extend: 'devilry.extjshelpers.RestfulSimplifiedEditWindowBase',

    config: {
        /**
         * @cfg
         * ``Ext.XTemplate`` for the url to visit on successful save. The
         * template gets the record data as input.
         */
        successUrlTpl: undefined,
        successfn: undefined
    },

    onSaveSuccess: function(record) {
        if(this.successfn) {
            this.successfn(record);
        }
        
        this.close();
    },

    initTools: function() {
        var me = this;

        /**
         * maximize bug, do not clone object
         */
        me.tools = me.tools || [];

        // Add a collapse tool unless configured to not show a collapse tool
        // or to not even show a header.
        if (me.collapsible && !(me.hideCollapseTool || me.header === false)) {
            me.collapseDirection = me.collapseDirection || me.headerPosition || 'top';
            me.collapseTool = me.expandTool = me.createComponent({
                xtype: 'tool',
                type: 'collapse-' + me.collapseDirection,
                expandType: me.getOppositeDirection(me.collapseDirection),
                handler: me.toggleCollapse,
                scope: me
            });

            // Prepend collapse tool is configured to do so.
            if (me.collapseFirst) {
                me.tools.unshift(me.collapseTool);
            }
        }

        // Add subclass-specific tools.
        me.addTools();

        // Make Panel closable.
        if (me.closable) {
            me.addClsWithUI('closable');
            me.addTool({
                type: 'close',
                handler: Ext.Function.bind(me.close, this, [])
            });
        }

        // Append collapse tool if needed.
        if (me.collapseTool && !me.collapseFirst) {
            me.tools.push(me.collapseTool);
        }
    }
});
