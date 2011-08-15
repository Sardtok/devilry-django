/** Panel to show StaticFeedback info.
 */
Ext.define('devilry.extjshelpers.assignmentgroup.StaticFeedbackInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.staticfeedbackinfo',
    cls: 'widget-staticfeedbackinfo',
    requires: [
        'devilry.extjshelpers.Pager',
        'devilry.extjshelpers.SingleRecordContainer',
        'devilry.extjshelpers.assignmentgroup.StaticFeedbackView'
    ],
    frame: false,
    //frameHeader: false,
    border: 0,
    title: 'Feedback',


    config: {
        /**
         * @cfg
         * FileMeta ``Ext.data.Store``. (Required).
         * _Note_ that ``filemetastore.proxy.extraParams`` is changed by this
         * class.
         */
        staticfeedbackstore: undefined,

        /**
         * @cfg
         * A {@link devilry.extjshelpers.SingleRecordContainer} for Delivery.
         */
        delivery_recordcontainer: undefined
    },


    constructor: function(config) {
        this.addEvents('afterStoreLoadMoreThanZero');
        this.callParent([config]);
        this.initConfig(config);
    },
    
    initComponent: function() {
        this.staticfeedback_recordcontainer = Ext.create('devilry.extjshelpers.SingleRecordContainer');
        this.bodyContent = Ext.create('Ext.container.Container');

        this.editToolbar = Ext.ComponentManager.create({
            xtype: 'toolbar',
            dock: 'bottom',
            width: 200,
            style: {
                border: 'none'
            },
            hidden: true
        });

        Ext.apply(this, {
            items: [this.bodyContent],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [this.editToolbar, '->', {
                    xtype: 'devilrypager',
                    store: this.staticfeedbackstore,
                    width: 200,
                    reverseDirection: true,
                    middleLabelTpl: Ext.create('Ext.XTemplate',
                        '<tpl if="firstRecord">',
                    '   {currentNegativePageOffset})&nbsp;&nbsp;',
                    '   {firstRecord.data.save_timestamp:date}',
                    '</tpl>'
                    )
                }]
            }],
        });

        this.callParent(arguments);

        this.staticfeedbackstore.pageSize = 1;
        this.staticfeedbackstore.proxy.extraParams.orderby = Ext.JSON.encode(['-save_timestamp']);

        this.staticfeedback_recordcontainer.addListener('setRecord', this.onSetStaticFeedbackRecord, this);
        this.staticfeedbackstore.addListener('load', this.onLoadStaticfeedbackstore, this);
        if(this.delivery_recordcontainer.record) {
            this.onLoadDelivery();
        }
        this.delivery_recordcontainer.addListener('setRecord', this.onLoadDelivery, this);
    },

    /**
     * @private
     */
    onLoadDelivery: function() {
        this.staticfeedbackstore.proxy.extraParams.filters = Ext.JSON.encode([{
            field: 'delivery',
            comp: 'exact',
            value: this.delivery_recordcontainer.record.data.id
        }]);
        this.staticfeedbackstore.load();
    },


    onSetStaticFeedbackRecord: function() {
        var isactive = this.staticfeedbackstore.currentPage == 1;
        this.setBody({
            xtype: 'staticfeedbackview',
            singlerecordontainer: this.staticfeedback_recordcontainer,
            extradata: {
                isactive: isactive
            }
        });
    },

    onLoadStaticfeedbackstore: function(store, records, successful) {
        if(successful) {
            if(records.length == 0) {
                //this.infotable.hide();
                this.editToolbar.hide();
                this.bodyWithNoFeedback();
            }
            else {
                //this.infotable.show();
                this.editToolbar.show();
                this.staticfeedback_recordcontainer.setRecord(records[0]);
                this.fireEvent('afterStoreLoadMoreThanZero');
            }
        } else {
            // TODO: handle failure
        }
    },

    setBody: function(content) {
        this.bodyContent.removeAll();
        this.bodyContent.add(content);
    },


    bodyWithNoFeedback: function() {
        this.setBody({
            xtype: 'component',
            cls: 'no-feedback',
            html: 'No feedback yet'
        });
    }
});
