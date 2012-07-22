/**
 * A view of a model record.
 * This is used for the administrator interface,
 * but could be used to do exercise views in the main interface in the future.
 * This is modelled after Devilry's PrettyView,
 * but currently we do not need management of Administrators.
 */
Ext.define('trix.ModelView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.modelview',
    bodyPadding: 20,
    border: 0,

    config: {
        /**
         * @cfg
         * The name of the ``Ext.data.Model`` to view. (Required).
         */
        modelname: undefined,

        /**
         * @cfg
         * The ID of the object to load from the model. (Required).
         */
        objectid: undefined,

        /**
         * @cfg
         * An ``Ext.XTemplate`` for the body of this view. (Required).
         */
        headerTpl: undefined,

        /**
         * @cfg
         * The url to the dashboard.
         * Used after delete to return to the dashboard.
         */
        dashboardUrl: undefined,

        /**
         * @cfg
         * The root url for static resources, e.g. icons.
         */
        staticUrl: undefined,

        /**
         * @cfg
         * Extra toolbar components.
         */
        extraTbarCmps: undefined
    },

    hidden: true,

    constructor: function(config) {
        this.callParent([config]);
        this.initConfig(config);
    },

    initComponent: function() {
        this.headerBox = Ext.widget('box', {
            autoScroll: true,
            padding: 20,
            flex: 1,
            tpl: this.headerTpl
        });

        if (this.extraTbarCmps != undefined){
            Ext.apply(this, {
                tbar: [this.headerBox, this.extraTbarCmps]
            });
        } else {
            Ext.apply(this, {
                tbar: this.headerBox
            });
        }
        this.callParent(arguments);

        var model = Ext.ModelManager.getModel(this.modelname);
        model.load(this.objectid, {
            scope: this,
            success: this.onModelLoadSuccess,
            failure: this.onModelLoadFailure
        });
    },

    onModelLoadSuccess: function(record) {
        this.record = record;
        this.refreshBody();
    },

    refreshBody: function() {
        this.headerBox.update(this.record.data);
        this.show();
    },

    refreshWrapper: function() {
        var me = this;
        var model = Ext.ModelManager.getModel(this.modelname);

        return function() {
            model.load(me.objectid, {
                scope: me,
                success: me.onModelLoadSuccess,
                failure: me.onModelLoadFailure
            });
        }
    },

    onModelLoadFailure: function(record, operation) {
        throw 'Failed to load the model';
    }
});
