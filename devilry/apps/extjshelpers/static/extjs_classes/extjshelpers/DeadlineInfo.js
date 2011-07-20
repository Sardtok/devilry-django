/** Deadline info.
 *
 * Lists deliveries and fires events when they are selected.
 *
 * @xtype deadlineinfo
 */
Ext.define('devilry.extjshelpers.DeadlineInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.deadlineinfo',
    cls: 'widget-deadlineinfo',
    margin: {bottom: 20},
    requires: [
        'devilry.extjshelpers.DeliveryGrid'
    ],
    titleTpl: Ext.create('Ext.XTemplate', '{deadline:date}'),

    config: {
        deadline: undefined
    },
    
    initComponent: function() {
        var deliverystore = Ext.create('Ext.data.Store', {
            model: 'devilry.apps.examiner.simplified.SimplifiedDelivery',
            remoteFilter: true,
            remoteSort: true,
            autoSync: true,
        });
        deliverystore.proxy.extraParams.orderby = Ext.JSON.encode(['-number']);
        deliverystore.proxy.extraParams.filters = Ext.JSON.encode([{
            field: 'deadline',
            comp: 'exact',
            value: this.deadline.id
        }]);
        deliverystore.load();

        Ext.apply(this, {
            title: this.titleTpl.apply(this.deadline),
            items: [{
                xtype: 'deliverygrid',
                store: deliverystore
            }]
        });
        this.callParent(arguments);
        this.addEvents('deliverySelected');
    },
});