Ext.define('trix.Exercise', {
    extend: 'Ext.data.Model',
    requires: ['devilry.extjshelpers.RestProxy'],
    fields: [
        {"type": "int", "name": "id"},
        {"type": "auto", "name": "short_name"},
        {"type": "auto", "name": "long_name"},
        {"type": "auto", "name": "text"},
        {"type": "int", "name": "points"},
        {"type": "auto", "name": "topics__id"},
        {"type": "auto", "name": "prerequisites__id"},
        {"type": "auto", "name": "topics__name"},
        {"type": "auto", "name": "prerequisites__name"},
        {"type": "auto", "name": "fake_topics"},
        {"type": "auto", "name": "fake_prerequisites"}],
    idProperty: 'id',
    proxy: Ext.create('devilry.extjshelpers.RestProxy', {
        url: '/trix/restfulsimplifiedexercise/',
        extraParams: {
            getdata_in_qrystring: true,
            result_fieldgroups: '["topics", "prerequisites"]'
        },

        reader: {
            type: 'json',
            root: 'items',
            totalProperty: 'total'
        },

        writer: {
            type: 'json'
        }
    })
});
